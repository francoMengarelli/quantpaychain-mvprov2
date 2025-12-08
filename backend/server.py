from fastapi import FastAPI, APIRouter, HTTPException, Header, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest
import httpx
from services_earnings import EarningsService
from models_earnings import AssetRevenue, DividendDistribution, PortfolioHolding

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Initialize Earnings Service
earnings_service = EarningsService(db)

# ============ MODELS ============
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    role: str = "user"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RWAAsset(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    asset_type: str  # real_estate, commodity, invoice, other
    description: str
    value_usd: float
    owner_id: str
    status: str = "active"  # active, tokenized, inactive
    metadata: Dict[str, Any] = {}
    blockchain_network: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class RWAAssetCreate(BaseModel):
    name: str
    asset_type: str
    description: str
    value_usd: float
    metadata: Optional[Dict[str, Any]] = {}

class Token(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    asset_id: str
    token_symbol: str
    total_supply: int
    available_supply: int
    price_per_token: float
    blockchain_network: str
    contract_address: str  # Simulated
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenCreate(BaseModel):
    asset_id: str
    token_symbol: str
    total_supply: int
    price_per_token: float
    blockchain_network: str

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    transaction_type: str  # buy, sell
    buyer_id: Optional[str] = None
    seller_id: Optional[str] = None
    token_id: str
    quantity: int
    total_amount: float
    status: str = "pending"  # pending, completed, failed
    payment_session_id: Optional[str] = None
    blockchain_tx_hash: str = Field(default_factory=lambda: f"0x{uuid.uuid4().hex}")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlockchainNetwork(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    symbol: str
    icon: str
    is_active: bool = True
    gas_fee_estimate: float

class PaymentTransaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str
    user_id: Optional[str] = None
    amount: float
    currency: str
    status: str = "pending"
    payment_status: str = "pending"
    metadata: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ISOReport(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    report_type: str
    data: Dict[str, Any]
    generated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============ AUTH HELPERS ============
async def get_current_user(request: Request) -> Optional[User]:
    # Try cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split("Bearer ")[1]
    
    if not session_token:
        return None
    
    # Check session
    session = await db.user_sessions.find_one({"session_token": session_token})
    if not session:
        return None
    
    # Convert expires_at to datetime if it's a string
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    
    # Make sure both datetimes are timezone-aware
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        return None
    
    # Get user
    user_doc = await db.users.find_one({"id": session["user_id"]}, {"_id": 0})
    if not user_doc:
        return None
    
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return User(**user_doc)

# ============ AUTH ENDPOINTS ============
@api_router.post("/auth/session")
async def create_session(request: Request, response: Response, x_session_id: str = Header(...)):
    """Process Emergent Auth session_id and create local session"""
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": x_session_id}
            )
            resp.raise_for_status()
            data = resp.json()
        
        # Check if user exists
        existing_user = await db.users.find_one({"email": data["email"]}, {"_id": 0})
        
        if existing_user:
            user = User(**existing_user)
        else:
            # Create new user
            user = User(
                id=data["id"],
                email=data["email"],
                name=data["name"],
                picture=data.get("picture")
            )
            user_dict = user.model_dump()
            user_dict['created_at'] = user_dict['created_at'].isoformat()
            await db.users.insert_one(user_dict)
        
        # Create session
        session_token = data["session_token"]
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        session = UserSession(
            user_id=user.id,
            session_token=session_token,
            expires_at=expires_at
        )
        
        session_dict = session.model_dump()
        session_dict['created_at'] = session_dict['created_at'].isoformat()
        session_dict['expires_at'] = session_dict['expires_at'].isoformat()
        await db.user_sessions.insert_one(session_dict)
        
        # Set cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7*24*60*60,
            path="/"
        )
        
        return {"user": user.model_dump(), "session_token": session_token}
    
    except Exception as e:
        logging.error(f"Session creation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie("session_token", path="/")
    return {"message": "Logged out"}

# ============ RWA ASSETS ENDPOINTS ============
@api_router.post("/assets", response_model=RWAAsset)
async def create_asset(asset_data: RWAAssetCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    asset = RWAAsset(
        **asset_data.model_dump(),
        owner_id=user.id
    )
    
    asset_dict = asset.model_dump()
    asset_dict['created_at'] = asset_dict['created_at'].isoformat()
    await db.rwa_assets.insert_one(asset_dict)
    
    return asset

@api_router.get("/assets", response_model=List[RWAAsset])
async def get_assets(asset_type: Optional[str] = None, blockchain: Optional[str] = None):
    query = {"status": "active"}
    if asset_type:
        query["asset_type"] = asset_type
    if blockchain:
        query["blockchain_network"] = blockchain
    
    assets = await db.rwa_assets.find(query, {"_id": 0}).to_list(1000)
    for asset in assets:
        if isinstance(asset.get('created_at'), str):
            asset['created_at'] = datetime.fromisoformat(asset['created_at'])
    return assets

@api_router.get("/assets/{asset_id}", response_model=RWAAsset)
async def get_asset(asset_id: str):
    asset = await db.rwa_assets.find_one({"id": asset_id}, {"_id": 0})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    if isinstance(asset.get('created_at'), str):
        asset['created_at'] = datetime.fromisoformat(asset['created_at'])
    return asset

# ============ TOKENS ENDPOINTS ============
@api_router.post("/tokens", response_model=Token)
async def create_token(token_data: TokenCreate, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Verify asset exists and user owns it
    asset = await db.rwa_assets.find_one({"id": token_data.asset_id, "owner_id": user.id})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found or not owned by user")
    
    token = Token(
        **token_data.model_dump(),
        available_supply=token_data.total_supply,
        contract_address=f"0x{uuid.uuid4().hex[:40]}"
    )
    
    token_dict = token.model_dump()
    token_dict['created_at'] = token_dict['created_at'].isoformat()
    await db.tokens.insert_one(token_dict)
    
    # Update asset status
    await db.rwa_assets.update_one(
        {"id": token_data.asset_id},
        {"$set": {"status": "tokenized", "blockchain_network": token_data.blockchain_network}}
    )
    
    return token

@api_router.get("/tokens", response_model=List[Token])
async def get_tokens(blockchain: Optional[str] = None):
    query = {"available_supply": {"$gt": 0}}
    if blockchain:
        query["blockchain_network"] = blockchain
    
    tokens = await db.tokens.find(query, {"_id": 0}).to_list(1000)
    for token in tokens:
        if isinstance(token.get('created_at'), str):
            token['created_at'] = datetime.fromisoformat(token['created_at'])
    return tokens

@api_router.get("/tokens/{token_id}", response_model=Token)
async def get_token(token_id: str):
    token = await db.tokens.find_one({"id": token_id}, {"_id": 0})
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    if isinstance(token.get('created_at'), str):
        token['created_at'] = datetime.fromisoformat(token['created_at'])
    return token

# ============ BLOCKCHAIN NETWORKS ============
@api_router.get("/blockchains", response_model=List[BlockchainNetwork])
async def get_blockchains():
    networks = [
        BlockchainNetwork(id="ethereum", name="Ethereum", symbol="ETH", icon="⟠", gas_fee_estimate=2.5),
        BlockchainNetwork(id="polygon", name="Polygon", symbol="MATIC", icon="◆", gas_fee_estimate=0.01),
        BlockchainNetwork(id="bsc", name="BNB Chain", symbol="BNB", icon="◉", gas_fee_estimate=0.1),
        BlockchainNetwork(id="solana", name="Solana", symbol="SOL", icon="◎", gas_fee_estimate=0.00025),
        BlockchainNetwork(id="avalanche", name="Avalanche", symbol="AVAX", icon="▲", gas_fee_estimate=0.5),
        BlockchainNetwork(id="arbitrum", name="Arbitrum", symbol="ARB", icon="◭", gas_fee_estimate=0.1),
    ]
    return networks

# ============ PAYMENTS ============
@api_router.post("/payments/checkout")
async def create_checkout(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    body = await request.json()
    token_id = body.get("token_id")
    quantity = body.get("quantity", 1)
    origin_url = body.get("origin_url")
    
    if not token_id or not origin_url:
        raise HTTPException(status_code=400, detail="token_id and origin_url required")
    
    # Get token
    token = await db.tokens.find_one({"id": token_id})
    if not token or token["available_supply"] < quantity:
        raise HTTPException(status_code=400, detail="Token not available")
    
    amount = float(token["price_per_token"] * quantity)
    
    # Setup Stripe
    host_url = origin_url
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(
        api_key=os.environ["STRIPE_API_KEY"],
        webhook_url=webhook_url
    )
    
    success_url = f"{origin_url}/payment-success?session_id={{{{CHECKOUT_SESSION_ID}}}}"
    cancel_url = f"{origin_url}/marketplace"
    
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": user.id,
            "token_id": token_id,
            "quantity": str(quantity)
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction
    payment = PaymentTransaction(
        session_id=session.session_id,
        user_id=user.id,
        amount=amount,
        currency="usd",
        status="initiated",
        payment_status="pending",
        metadata={
            "token_id": token_id,
            "quantity": quantity
        }
    )
    
    payment_dict = payment.model_dump()
    payment_dict['created_at'] = payment_dict['created_at'].isoformat()
    await db.payment_transactions.insert_one(payment_dict)
    
    return {"url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str, request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get payment transaction
    payment = await db.payment_transactions.find_one({"session_id": session_id})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Check Stripe status
    stripe_checkout = StripeCheckout(
        api_key=os.environ["STRIPE_API_KEY"],
        webhook_url=""
    )
    
    try:
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update payment status
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"status": status.status, "payment_status": status.payment_status}}
        )
        
        # If paid and not processed yet, create transaction
        if status.payment_status == "paid" and payment["status"] != "completed":
            token_id = payment["metadata"]["token_id"]
            quantity = int(payment["metadata"]["quantity"])
            
            # Create transaction
            transaction = Transaction(
                transaction_type="buy",
                buyer_id=user.id,
                token_id=token_id,
                quantity=quantity,
                total_amount=payment["amount"],
                status="completed",
                payment_session_id=session_id
            )
            
            trans_dict = transaction.model_dump()
            trans_dict['created_at'] = trans_dict['created_at'].isoformat()
            await db.transactions.insert_one(trans_dict)
            
            # Update token supply
            await db.tokens.update_one(
                {"id": token_id},
                {"$inc": {"available_supply": -quantity}}
            )
            
            # Mark payment as completed
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {"status": "completed"}}
            )
        
        return status.model_dump()
    except Exception as e:
        logging.error(f"Payment status error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    body_bytes = await request.body()
    signature = request.headers.get("Stripe-Signature")
    
    stripe_checkout = StripeCheckout(
        api_key=os.environ["STRIPE_API_KEY"],
        webhook_url=""
    )
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body_bytes, signature)
        logging.info(f"Webhook received: {webhook_response}")
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Webhook error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# ============ TRANSACTIONS ============
@api_router.get("/transactions", response_model=List[Transaction])
async def get_transactions(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    transactions = await db.transactions.find(
        {"$or": [{"buyer_id": user.id}, {"seller_id": user.id}]},
        {"_id": 0}
    ).to_list(1000)
    
    for trans in transactions:
        if isinstance(trans.get('created_at'), str):
            trans['created_at'] = datetime.fromisoformat(trans['created_at'])
    
    return transactions

# ============ AI ANALYSIS ============
@api_router.post("/ai/analyze-asset")
async def analyze_asset(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    body = await request.json()
    asset_data = body.get("asset_data")
    
    if not asset_data:
        raise HTTPException(status_code=400, detail="asset_data required")
    
    # Initialize AI chat
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"analysis_{uuid.uuid4()}",
        system_message="You are an expert in Real World Asset (RWA) tokenization and financial analysis. Provide detailed, professional analysis."
    )
    chat.with_model("openai", "gpt-4o")
    
    prompt = f"""Analyze this Real World Asset for tokenization:

Asset Name: {asset_data.get('name')}
Type: {asset_data.get('asset_type')}
Value: ${asset_data.get('value_usd'):,.2f}
Description: {asset_data.get('description')}

Provide:
1. Investment viability score (1-10)
2. Risk assessment
3. Tokenization recommendations
4. Market potential
5. Compliance considerations for ISO 20022
"""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    return {"analysis": response}

@api_router.post("/reports/generate")
async def generate_iso_report(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    body = await request.json()
    report_type = body.get("report_type", "transaction_summary")
    
    # Get user transactions
    transactions = await db.transactions.find(
        {"$or": [{"buyer_id": user.id}, {"seller_id": user.id}]},
        {"_id": 0}
    ).to_list(1000)
    
    # Initialize AI for ISO 20022 formatting
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"report_{uuid.uuid4()}",
        system_message="You are an expert in ISO 20022 financial messaging standards. Generate compliant reports."
    )
    chat.with_model("openai", "gpt-4o")
    
    prompt = f"""Generate an ISO 20022 compliant {report_type} report for these transactions:

{transactions}

Include:
1. Transaction summary
2. Total volume and value
3. Asset breakdown
4. Compliance status
5. Formatted according to ISO 20022 standards
"""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    # Save report
    report = ISOReport(
        user_id=user.id,
        report_type=report_type,
        data={"content": response, "transactions_count": len(transactions)}
    )
    
    report_dict = report.model_dump()
    report_dict['generated_at'] = report_dict['generated_at'].isoformat()
    await db.iso_reports.insert_one(report_dict)
    
    return {"report": response, "report_id": report.id}

@api_router.get("/reports", response_model=List[ISOReport])
async def get_reports(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    reports = await db.iso_reports.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("generated_at", -1).to_list(100)
    
    for report in reports:
        if isinstance(report.get('generated_at'), str):
            report['generated_at'] = datetime.fromisoformat(report['generated_at'])
    
    return reports

# ============ DASHBOARD STATS ============
@api_router.get("/dashboard/stats")
async def get_dashboard_stats(request: Request):
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Get user's assets
    assets_count = await db.rwa_assets.count_documents({"owner_id": user.id})
    
    # Get user's transactions
    transactions = await db.transactions.find(
        {"buyer_id": user.id, "status": "completed"},
        {"_id": 0}
    ).to_list(1000)
    
    total_invested = sum(t["total_amount"] for t in transactions)
    
    # Get available tokens count
    tokens_count = await db.tokens.count_documents({"available_supply": {"$gt": 0}})
    
    return {
        "my_assets": assets_count,
        "total_invested": total_invested,
        "transactions_count": len(transactions),
        "available_tokens": tokens_count
    }

# ============ EARNINGS & DIVIDENDS ENDPOINTS ============

@api_router.post("/earnings/revenue")
async def record_revenue(request: Request):
    """Record revenue for an asset"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    body = await request.json()
    asset_id = body.get("asset_id")
    amount = body.get("amount")
    revenue_type = body.get("revenue_type", "other")
    description = body.get("description", "")
    
    # Verify user owns the asset
    asset = await db.rwa_assets.find_one({"id": asset_id, "owner_id": user.id})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found or not owned")
    
    revenue = await earnings_service.record_asset_revenue(
        asset_id, amount, revenue_type, description
    )
    
    return {"success": True, "revenue": revenue.model_dump()}

@api_router.post("/earnings/distribute-dividends/{asset_id}")
async def distribute_dividends(asset_id: str, request: Request):
    """Distribute dividends to token holders"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    
    # Verify user owns the asset
    asset = await db.rwa_assets.find_one({\"id\": asset_id, \"owner_id\": user.id})
    if not asset:
        raise HTTPException(status_code=404, detail=\"Asset not found or not owned\")
    
    body = await request.json()
    period = body.get(\"period\", datetime.now(timezone.utc).strftime(\"%Y-%m\"))
    
    result = await earnings_service.distribute_dividends(asset_id, period)
    return result

@api_router.get(\"/earnings/asset/{asset_id}/performance\")
async def get_asset_performance(asset_id: str):
    \"\"\"Get performance metrics for an asset\"\"\"
    performance = await earnings_service.get_asset_performance(asset_id)
    return performance

@api_router.get(\"/earnings/portfolio\")
async def get_portfolio(request: Request):
    \"\"\"Get user's complete portfolio with ROI\"\"\"
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    
    portfolio = await earnings_service.get_user_portfolio(user.id)
    return portfolio

@api_router.get(\"/earnings/dividends\")
async def get_my_dividends(request: Request):
    \"\"\"Get user's dividend history\"\"\"
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    
    dividends = await db.dividend_distributions.find(
        {\"user_id\": user.id},
        {\"_id\": 0}
    ).sort(\"distribution_date\", -1).to_list(1000)
    
    for div in dividends:
        if isinstance(div.get('distribution_date'), str):
            div['distribution_date'] = datetime.fromisoformat(div['distribution_date'])
    
    return dividends

@api_router.get(\"/earnings/platform-stats\")
async def get_platform_stats(request: Request):
    \"\"\"Get platform earnings statistics (admin only)\"\"\"
    user = await get_current_user(request)
    if not user or user.role != \"admin\":
        raise HTTPException(status_code=403, detail=\"Admin access required\")
    
    stats = await earnings_service.get_platform_earnings()
    return stats

# ============ ENHANCED TRANSACTIONS (with portfolio tracking) ============

@api_router.post(\"/transactions/complete-purchase\")
async def complete_purchase(request: Request):
    \"\"\"Complete token purchase and update portfolio\"\"\"
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail=\"Not authenticated\")
    
    body = await request.json()
    token_id = body.get(\"token_id\")
    quantity = body.get(\"quantity\")
    
    # Get token
    token = await db.tokens.find_one({\"id\": token_id})
    if not token or token[\"available_supply\"] < quantity:
        raise HTTPException(status_code=400, detail=\"Insufficient tokens available\")
    
    # Calculate price with platform fee
    base_price = token[\"price_per_token\"] * quantity
    platform_fee = base_price * 0.05
    total_price = base_price + platform_fee
    
    # Create transaction
    transaction = Transaction(
        transaction_type=\"buy\",
        buyer_id=user.id,
        token_id=token_id,
        quantity=quantity,
        total_amount=total_price,
        status=\"completed\"
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    # Update token supply
    await db.tokens.update_one(
        {\"id\": token_id},
        {\"$inc\": {\"available_supply\": -quantity}}
    )
    
    # Update/create portfolio holding
    holding = await earnings_service.create_or_update_holding(
        user_id=user.id,
        token_id=token_id,
        asset_id=token[\"asset_id\"],
        quantity=quantity,
        price_per_token=token[\"price_per_token\"]
    )
    
    return {
        \"success\": True,
        \"transaction\": transaction.model_dump(),
        \"holding\": holding.model_dump()
    }

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()