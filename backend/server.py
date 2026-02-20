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
from services.jurisdictions import get_jurisdiction, get_all_jurisdictions, get_jurisdiction_summary, get_jurisdiction_risk_score
from services.pqc_real_service import get_pqc_service
from services.kyc_aml_real_service import get_kyc_aml_service

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

# ============ JURISDICTIONS ============
@api_router.get("/jurisdictions")
async def list_jurisdictions():
    """Get all available jurisdictions for tokenization analysis"""
    return get_all_jurisdictions()

@api_router.get("/jurisdictions/{code}")
async def get_jurisdiction_detail(code: str):
    """Get detailed jurisdiction profile"""
    summary = get_jurisdiction_summary(code.upper())
    if "error" in summary:
        raise HTTPException(status_code=404, detail=f"Jurisdiction {code} not found")
    return summary

# ============ AI JURISDICTIONAL ANALYSIS (Demo - No Auth for Testing) ============
@api_router.post("/ai/jurisdictional-analysis-demo")
async def jurisdictional_analysis_demo(request: Request):
    """
    Demo endpoint for jurisdictional analysis (no auth required).
    Use /ai/jurisdictional-analysis for production.
    """
    body = await request.json()
    
    # Extract data
    asset_data = body.get("asset", {})
    jurisdiction_code = body.get("jurisdiction_code", "").upper()
    tokenization_intent = body.get("tokenization_intent", {})
    
    if not jurisdiction_code:
        raise HTTPException(status_code=400, detail="jurisdiction_code required")
    
    # Get jurisdiction profile
    jurisdiction = get_jurisdiction(jurisdiction_code)
    if not jurisdiction:
        raise HTTPException(status_code=404, detail=f"Jurisdiction {jurisdiction_code} not supported")
    
    jurisdiction_summary = get_jurisdiction_summary(jurisdiction_code)
    risk_score = get_jurisdiction_risk_score(jurisdiction_code)
    
    # Build comprehensive prompt with institutional-grade positioning
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"demo_jurisdictional_{uuid.uuid4()}",
        system_message="""You are a SENIOR RWA REGULATORY & RISK ADVISORY ENGINE.

Your role is to provide strategic, jurisdiction-aware risk intelligence and decision support for real-world asset (RWA) tokenization projects.

You are NOT acting as a legal advisor and you do NOT provide legal opinions. Your output is a pre-legal, analytical assessment designed to support informed decision-making prior to engaging qualified legal counsel.

EXPERTISE DOMAINS:
- Real-World Asset (RWA) tokenization frameworks
- International securities and financial regulatory landscapes
- Blockchain-agnostic regulatory risk assessment
- Multi-jurisdictional compliance considerations
- SPV and asset-holding structure analysis (conceptual level)
- KYC/AML and financial compliance risk classification

OPERATING PRINCIPLES:
1. JURISDICTION-AWARE: Clearly state the jurisdictional context and adapt analysis accordingly.
2. RISK-FOCUSED: Identify and classify regulatory, operational, and structural risks (Low / Medium / High).
3. STRUCTURED & PRACTICAL: Provide clear, numbered steps and decision-oriented guidance.
4. NON-BINDING: Avoid definitive legal conclusions; frame outputs as considerations, indicators, and recommendations.
5. BLOCKCHAIN-AGNOSTIC: Do not assume or enforce any specific blockchain implementation.
6. SCOPE-BOUNDARIES: Explicitly state what is within scope and what must be handled by legal advisors.
7. EXECUTIVE-GRADE: Write in a clear, professional tone suitable for decision-makers.

Always respond in the same language as the user's input (Spanish if input is in Spanish)."""
    )
    chat.with_model("openai", "gpt-4o")
    
    # Determine recommendation based on risk score
    if risk_score < 40:
        decision_recommendation = "PROCEED"
        decision_emoji = "✅"
        decision_color = "green"
    elif risk_score < 70:
        decision_recommendation = "PROCEED_WITH_CONDITIONS"
        decision_emoji = "⚠️"
        decision_color = "yellow"
    else:
        decision_recommendation = "DO_NOT_PROCEED"
        decision_emoji = "❌"
        decision_color = "red"
    
    # Determine investor type based on value and jurisdiction
    asset_value = asset_data.get('value_usd', 0)
    if risk_score > 70 or asset_value > 1000000:
        target_investors = "INSTITUTIONAL_ONLY"
    elif risk_score > 50 or asset_value > 500000:
        target_investors = "ACCREDITED_ONLY"
    else:
        target_investors = "QUALIFIED_RETAIL"
    
    prompt = f"""
Genera un PRE-LEGAL REGULATORY DOSSIER de nivel institucional para tokenización de activos reales (RWA).

## DATOS DEL ACTIVO
- Tipo: {asset_data.get('type', 'No especificado')}
- Valor estimado: ${asset_data.get('value_usd', 0):,.2f} USD
- Ubicación del activo: {asset_data.get('location', jurisdiction.name)}
- Descripción: {asset_data.get('description', 'No proporcionada')}

## PERFIL JURISDICCIONAL: {jurisdiction.name}
- Región: {jurisdiction.region}
- Madurez regulatoria: {jurisdiction.regulatory_profile.get('maturity')}
- Marco de tokenización: {jurisdiction.regulatory_profile.get('tokenization_framework')}
- Regulador principal: {jurisdiction.regulatory_profile.get('regulator')}
- Sandbox disponible: {'Sí' if jurisdiction.regulatory_profile.get('sandbox_available') else 'No'}

## REQUISITOS REGULATORIOS
- KYC requerido: {'Sí' if jurisdiction.requirements.get('kyc_required') else 'No'}
- AML requerido: {'Sí' if jurisdiction.requirements.get('aml_required') else 'No'}
- Solo inversores acreditados: {jurisdiction.requirements.get('accredited_investor_only')}

## INDICADORES DE RIESGO (Score: {risk_score}/100)
- Riesgo regulatorio: {jurisdiction.risk_factors.get('regulatory_risk')}
- Claridad del marco legal: {jurisdiction.risk_factors.get('legal_clarity')}
- Recomendación automática del sistema: {decision_recommendation}
- Perfil de inversor sugerido: {target_investors}

## ESTRUCTURAS TÍPICAS EN {jurisdiction.name}
{chr(10).join(f'- {s}' for s in jurisdiction.typical_structures)}

## ESTIMACIONES DE REFERENCIA
- Timeline típico: {jurisdiction.estimated_timeline_days} días
- Rango de costos: ${jurisdiction.estimated_legal_cost_usd.get('min'):,} - ${jurisdiction.estimated_legal_cost_usd.get('max'):,} USD

---

GENERA UN INFORME EJECUTIVO con las siguientes secciones EXACTAS (respeta el formato):

## 1. DECISION SUMMARY (CRÍTICO - PRIMERA PÁGINA)

### RECOMENDACIÓN FINAL
[Usa EXACTAMENTE uno de estos: ✅ PROCEED | ⚠️ PROCEED WITH CONDITIONS | ❌ DO NOT PROCEED]

### DECISIÓN EN UNA LÍNEA
[Una oración clara y directa sobre qué hacer]

### TARGET INVESTORS
[EXACTAMENTE uno: Institutional Only | Accredited Only | Qualified Retail]

### ESTRUCTURA RECOMENDADA (UNA SOLA)
[Elige UNA estructura específica y justifica en una línea]

### JURISDICCIÓN VIABLE
[Sí/No con razón breve]

### PRESUPUESTO MÍNIMO REQUERIDO
[Número específico en USD]

### TIMELINE MÍNIMO
[Número de meses]

### RED FLAGS CRÍTICOS (máximo 3)
- [Red flag 1 - específico]
- [Red flag 2 - específico]
- [Red flag 3 - específico]

---

## 2. COMPARATIVA DE ESTRUCTURAS

Presenta una tabla comparativa con EXACTAMENTE este formato:

| Estructura | Riesgo | Costo Est. | Timeline | Viabilidad |
|------------|--------|------------|----------|------------|
| [Opción 1] | [Alto/Medio/Bajo] | [$XXX,XXX] | [X meses] | [✅/⚠️/❌] |
| [Opción 2] | [Alto/Medio/Bajo] | [$XXX,XXX] | [X meses] | [✅/⚠️/❌] |
| [Opción 3] | [Alto/Medio/Bajo] | [$XXX,XXX] | [X meses] | [✅/⚠️/❌] |

**Recomendación:** [Cuál elegir y POR QUÉ en una línea]

---

## 3. CHECKLIST OPERATIVO

Lista de tareas CONCRETAS y EJECUTABLES:

### Pre-Estructuración (Semanas 1-4)
- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Tarea específica 3]

### Estructuración Legal (Semanas 5-12)
- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Tarea específica 3]

### Compliance & KYC (Semanas 8-16)
- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]
- [ ] [Tarea específica 3]

### Go-to-Market (Semanas 12-20)
- [ ] [Tarea específica 1]
- [ ] [Tarea específica 2]

---

## 4. ANÁLISIS DE RIESGOS

### Riesgos NO Mitigables (Deal Breakers)
[Lista de riesgos que NO se pueden resolver - ser honesto]

### Riesgos Mitigables con Costo
| Riesgo | Mitigación | Costo Adicional |
|--------|------------|-----------------|
| [Riesgo 1] | [Cómo mitigar] | [$X,XXX] |
| [Riesgo 2] | [Cómo mitigar] | [$X,XXX] |

### Riesgos Asumibles
[Riesgos aceptables para el perfil del proyecto]

---

## 5. CONTEXTO REGULATORIO

### Marco Aplicable
[Descripción concisa del marco regulatorio - sin interpretación legal]

### Regulador y Enforcement
[Quién regula y nivel de enforcement]

### Precedentes Relevantes
[Casos similares en la jurisdicción si existen]

---

## 6. ESTIMACIÓN DE COSTOS DETALLADA

| Concepto | Rango Estimado | Obligatorio |
|----------|----------------|-------------|
| Counsel legal local | $XX,XXX - $XX,XXX | Sí |
| Estructuración SPV/vehículo | $XX,XXX - $XX,XXX | Sí |
| Compliance KYC/AML setup | $XX,XXX - $XX,XXX | Sí |
| Auditoría/Due Diligence | $XX,XXX - $XX,XXX | Recomendado |
| Plataforma tecnológica | $XX,XXX - $XX,XXX | Sí |
| Contingencia (15%) | $XX,XXX | Sí |
| **TOTAL ESTIMADO** | **$XXX,XXX - $XXX,XXX** | |

---

## 7. TIMELINE DETALLADO

```
Mes 1-2:   [Fase 1 - descripción]
Mes 3-4:   [Fase 2 - descripción]
Mes 5-6:   [Fase 3 - descripción]
Mes 7+:    [Fase 4 - descripción]
```

**Hito crítico:** [Cuál es el punto de no retorno]

---

## 8. ALCANCE Y LIMITACIONES

**ESTE DOCUMENTO ES:**
- Un Pre-Legal Regulatory Dossier para toma de decisiones
- Inteligencia regulatoria y de riesgo
- Base para conversaciones con counsel legal

**ESTE DOCUMENTO NO ES:**
- Asesoría legal, fiscal o de inversión
- Garantía de viabilidad o éxito
- Sustituto de counsel legal especializado

**PRÓXIMO PASO OBLIGATORIO:**
Validar este análisis con abogados especializados en securities de {jurisdiction.name} antes de cualquier acción.

---

*QuantPayChain - Pre-Legal Regulatory Intelligence for RWA*
"""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    return {
        "report_id": f"QPC-{jurisdiction_code}-{str(uuid.uuid4())[:8].upper()}",
        "report_type": "PRE_LEGAL_REGULATORY_DOSSIER",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "jurisdiction": {
            "code": jurisdiction_code,
            "name": jurisdiction.name,
            "region": jurisdiction.region,
            "risk_score": risk_score
        },
        "decision": {
            "recommendation": decision_recommendation,
            "emoji": decision_emoji,
            "color": decision_color,
            "target_investors": target_investors,
            "min_budget_usd": jurisdiction.estimated_legal_cost_usd.get('min'),
            "estimated_timeline_months": round(jurisdiction.estimated_timeline_days / 30)
        },
        "asset_summary": {
            "type": asset_data.get('type'),
            "value_usd": asset_data.get('value_usd'),
            "location": asset_data.get('location')
        },
        "analysis": response,
        "metadata": {
            "regulatory_maturity": jurisdiction.regulatory_profile.get('maturity'),
            "estimated_timeline_days": jurisdiction.estimated_timeline_days,
            "estimated_cost_range": jurisdiction.estimated_legal_cost_usd,
            "regulator": jurisdiction.regulatory_profile.get('regulator'),
            "sandbox_available": jurisdiction.regulatory_profile.get('sandbox_available')
        }
    }

# ============ AI JURISDICTIONAL ANALYSIS (Enhanced) ============
@api_router.post("/ai/jurisdictional-analysis")
async def jurisdictional_analysis(request: Request):
    """
    AI-powered jurisdictional analysis for RWA tokenization.
    Generates comprehensive legal and compliance report based on location.
    """
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    body = await request.json()
    
    # Extract data
    asset_data = body.get("asset", {})
    jurisdiction_code = body.get("jurisdiction_code", "").upper()
    tokenization_intent = body.get("tokenization_intent", {})
    
    if not jurisdiction_code:
        raise HTTPException(status_code=400, detail="jurisdiction_code required")
    
    # Get jurisdiction profile
    jurisdiction = get_jurisdiction(jurisdiction_code)
    if not jurisdiction:
        raise HTTPException(status_code=404, detail=f"Jurisdiction {jurisdiction_code} not supported")
    
    jurisdiction_summary = get_jurisdiction_summary(jurisdiction_code)
    risk_score = get_jurisdiction_risk_score(jurisdiction_code)
    
    # Build comprehensive prompt with institutional-grade positioning
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"jurisdictional_{uuid.uuid4()}",
        system_message="""You are a SENIOR RWA REGULATORY & RISK ADVISORY ENGINE.

Your role is to provide strategic, jurisdiction-aware risk intelligence and decision support for real-world asset (RWA) tokenization projects.

You are NOT acting as a legal advisor and you do NOT provide legal opinions. Your output is a pre-legal, analytical assessment designed to support informed decision-making prior to engaging qualified legal counsel.

EXPERTISE DOMAINS:
- Real-World Asset (RWA) tokenization frameworks
- International securities and financial regulatory landscapes
- Blockchain-agnostic regulatory risk assessment
- Multi-jurisdictional compliance considerations
- SPV and asset-holding structure analysis (conceptual level)
- KYC/AML and financial compliance risk classification

OPERATING PRINCIPLES:
1. JURISDICTION-AWARE: Clearly state the jurisdictional context and adapt analysis accordingly.
2. RISK-FOCUSED: Identify and classify regulatory, operational, and structural risks (Low / Medium / High).
3. STRUCTURED & PRACTICAL: Provide clear, numbered steps and decision-oriented guidance.
4. NON-BINDING: Avoid definitive legal conclusions; frame outputs as considerations, indicators, and recommendations.
5. BLOCKCHAIN-AGNOSTIC: Do not assume or enforce any specific blockchain implementation.
6. SCOPE-BOUNDARIES: Explicitly state what is within scope and what must be handled by legal advisors.
7. EXECUTIVE-GRADE: Write in a clear, professional tone suitable for decision-makers.

Always respond in the same language as the user's input."""
    )
    chat.with_model("openai", "gpt-4o")
    
    prompt = f"""
Genera un ANÁLISIS DE RIESGO E INTELIGENCIA REGULATORIA para tokenizar el siguiente activo en {jurisdiction.name}:

## DATOS DEL ACTIVO
- Tipo: {asset_data.get('type', 'No especificado')}
- Valor estimado: ${asset_data.get('value_usd', 0):,.2f} USD
- Ubicación del activo: {asset_data.get('location', jurisdiction.name)}
- Descripción: {asset_data.get('description', 'No proporcionada')}

## PERFIL JURISDICCIONAL: {jurisdiction.name}
- Región: {jurisdiction.region}
- Madurez regulatoria: {jurisdiction.regulatory_profile.get('maturity')}
- Marco de tokenización: {jurisdiction.regulatory_profile.get('tokenization_framework')}
- Regulador principal: {jurisdiction.regulatory_profile.get('regulator')}
- Sandbox disponible: {'Sí' if jurisdiction.regulatory_profile.get('sandbox_available') else 'No'}

## REQUISITOS DE REFERENCIA
- KYC requerido: {'Sí' if jurisdiction.requirements.get('kyc_required') else 'No'}
- AML requerido: {'Sí' if jurisdiction.requirements.get('aml_required') else 'No'}
- Solo inversores acreditados: {jurisdiction.requirements.get('accredited_investor_only')}
- Prospecto requerido: {jurisdiction.requirements.get('prospectus_required')}

## INDICADORES DE RIESGO
- Riesgo regulatorio: {jurisdiction.risk_factors.get('regulatory_risk')}
- Claridad del marco legal: {jurisdiction.risk_factors.get('legal_clarity')}
- Riesgo de enforcement: {jurisdiction.risk_factors.get('enforcement_risk')}

## PARÁMETROS DE TOKENIZACIÓN
- Tipo de oferta: {tokenization_intent.get('offering_type', 'privada')}
- Inversores objetivo: {tokenization_intent.get('target_investors', 'acreditados')}
- Blockchains consideradas: {', '.join(tokenization_intent.get('target_chains', ['ethereum']))}

## ESTRUCTURAS DE REFERENCIA EN {jurisdiction.name}
{chr(10).join(f'- {s}' for s in jurisdiction.typical_structures)}

## ESTIMACIONES DE MERCADO
- Timeline típico: {jurisdiction.estimated_timeline_days} días
- Rango de costos de compliance: ${jurisdiction.estimated_legal_cost_usd.get('min'):,} - ${jurisdiction.estimated_legal_cost_usd.get('max'):,} USD

---

Genera un INFORME DE INTELIGENCIA REGULATORIA Y ANÁLISIS DE RIESGO con las siguientes secciones:

### 1. RESUMEN EJECUTIVO
- Clasificación de viabilidad: FAVORABLE / VIABLE CON CONSIDERACIONES / REQUIERE ANÁLISIS ADICIONAL
- Indicador de riesgo agregado (0-100)
- Síntesis ejecutiva en 2-3 oraciones

### 2. CONTEXTO REGULATORIO JURISDICCIONAL
- Marco regulatorio de referencia (descriptivo, sin interpretación legal)
- Consideraciones clave para el tipo de activo
- Indicadores favorables y factores de atención

### 3. CLASIFICACIÓN CONCEPTUAL DEL ACTIVO
- Categorización preliminar (security token / utility token / híbrido)
- Indicadores relevantes para la clasificación
- NOTA: Esta categorización es orientativa y requiere validación legal

### 4. CONSIDERACIONES DE COMPLIANCE
- Requisitos típicos de KYC/AML en la jurisdicción
- Documentación estándar esperada
- Consideraciones estructurales relevantes

### 5. OPCIONES DE ESTRUCTURA
- Alternativas de estructura (SPV, fideicomiso, sociedad, etc.)
- Análisis comparativo basado en prácticas de mercado
- NOTA: Requiere validación con asesoría legal especializada

### 6. ROADMAP DE SIGUIENTE PASOS
- Fases recomendadas con timeline indicativo
- Hitos de decisión clave
- Dependencias y prerequisitos identificados

### 7. ESTIMACIÓN DE COSTOS (RANGO INDICATIVO)
- Costos de compliance estimados
- Costos de estructuración
- Costos de implementación técnica
- Rango total indicativo

### 8. MATRIZ DE RIESGOS Y CONSIDERACIONES
- Riesgos regulatorios identificados (Bajo/Medio/Alto)
- Riesgos operativos
- Consideraciones de mitigación

### 9. ALCANCE Y LIMITACIONES

**IMPORTANTE - LEER CUIDADOSAMENTE:**

Este documento constituye un ANÁLISIS PRE-LEGAL de inteligencia regulatoria y riesgo. 

- NO constituye asesoría legal, fiscal, financiera o de inversión
- NO reemplaza la consulta con abogados especializados en la jurisdicción
- Las clasificaciones y recomendaciones son INDICATIVAS y basadas en información pública disponible
- Se recomienda VALIDAR todas las conclusiones con asesoría legal especializada antes de tomar decisiones

QuantPayChain opera como motor de inteligencia y decisión, NO como asesor legal.
"""
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    # Structure the response
    result = {
        "report_id": str(uuid.uuid4()),
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "jurisdiction": {
            "code": jurisdiction_code,
            "name": jurisdiction.name,
            "region": jurisdiction.region,
            "risk_score": risk_score
        },
        "asset_summary": {
            "type": asset_data.get('type'),
            "value_usd": asset_data.get('value_usd'),
            "location": asset_data.get('location')
        },
        "analysis": response,
        "metadata": {
            "regulatory_maturity": jurisdiction.regulatory_profile.get('maturity'),
            "estimated_timeline_days": jurisdiction.estimated_timeline_days,
            "estimated_cost_range": jurisdiction.estimated_legal_cost_usd,
            "typical_structures": jurisdiction.typical_structures
        }
    }
    
    # Save report to database
    await db.jurisdictional_reports.insert_one({
        **result,
        "user_id": user.id,
        "_id": result["report_id"]
    })
    
    return result

@api_router.get("/ai/reports")
async def get_user_reports(request: Request):
    """Get user's jurisdictional analysis reports"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    reports = await db.jurisdictional_reports.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("generated_at", -1).to_list(100)
    
    return reports

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
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # Verify user owns the asset
    asset = await db.rwa_assets.find_one({"id": asset_id, "owner_id": user.id})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found or not owned")
    
    body = await request.json()
    period = body.get("period", datetime.now(timezone.utc).strftime("%Y-%m"))
    
    result = await earnings_service.distribute_dividends(asset_id, period)
    return result

@api_router.get("/earnings/asset/{asset_id}/performance")
async def get_asset_performance(asset_id: str):
    """Get performance metrics for an asset"""
    performance = await earnings_service.get_asset_performance(asset_id)
    return performance

@api_router.get("/earnings/portfolio")
async def get_portfolio(request: Request):
    """Get user's complete portfolio with ROI"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    portfolio = await earnings_service.get_user_portfolio(user.id)
    return portfolio

@api_router.get("/earnings/dividends")
async def get_my_dividends(request: Request):
    """Get user's dividend history"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    dividends = await db.dividend_distributions.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("distribution_date", -1).to_list(1000)
    
    for div in dividends:
        if isinstance(div.get('distribution_date'), str):
            div['distribution_date'] = datetime.fromisoformat(div['distribution_date'])
    
    return dividends

@api_router.get("/earnings/platform-stats")
async def get_platform_stats(request: Request):
    """Get platform earnings statistics (admin only)"""
    user = await get_current_user(request)
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    stats = await earnings_service.get_platform_earnings()
    return stats

# ============ ENHANCED TRANSACTIONS (with portfolio tracking) ============

@api_router.post("/transactions/complete-purchase")
async def complete_purchase(request: Request):
    """Complete token purchase and update portfolio"""
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    body = await request.json()
    token_id = body.get("token_id")
    quantity = body.get("quantity")
    
    # Get token
    token = await db.tokens.find_one({"id": token_id})
    if not token or token["available_supply"] < quantity:
        raise HTTPException(status_code=400, detail="Insufficient tokens available")
    
    # Calculate price with platform fee
    base_price = token["price_per_token"] * quantity
    platform_fee = base_price * 0.05
    total_price = base_price + platform_fee
    
    # Create transaction
    transaction = Transaction(
        transaction_type="buy",
        buyer_id=user.id,
        token_id=token_id,
        quantity=quantity,
        total_amount=total_price,
        status="completed"
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    # Update token supply
    await db.tokens.update_one(
        {"id": token_id},
        {"$inc": {"available_supply": -quantity}}
    )
    
    # Update/create portfolio holding
    holding = await earnings_service.create_or_update_holding(
        user_id=user.id,
        token_id=token_id,
        asset_id=token["asset_id"],
        quantity=quantity,
        price_per_token=token["price_per_token"]
    )
    
    return {
        "success": True,
        "transaction": transaction.model_dump(),
        "holding": holding.model_dump()
    }

# ============ PQC (POST-QUANTUM CRYPTOGRAPHY) ENDPOINTS ============

class PQCKeyPairRequest(BaseModel):
    algorithm: str = "Kyber768"

class PQCSignRequest(BaseModel):
    message: str
    secret_key: str
    algorithm: str = "Dilithium3"

class PQCVerifyRequest(BaseModel):
    message: str
    signature: str
    public_key: str
    algorithm: str = "Dilithium3"
    binding_hash: Optional[str] = None

class PQCEncapsulateRequest(BaseModel):
    public_key: str
    algorithm: str = "Kyber768"

class PQCDecapsulateRequest(BaseModel):
    ciphertext: str
    secret_key: str
    algorithm: str = "Kyber768"

class PQCTokenizeRequest(BaseModel):
    asset_data: Dict[str, Any]
    secret_key: str
    algorithm: str = "Dilithium3"

class PQCVerifyTokenRequest(BaseModel):
    asset_data: Dict[str, Any]
    certificate: Dict[str, Any]
    public_key: str

@api_router.get("/pqc/algorithms")
async def get_pqc_algorithms():
    """Lista algoritmos PQC disponibles"""
    pqc = get_pqc_service()
    return pqc.get_available_algorithms()

@api_router.post("/pqc/generate-kem-keypair")
async def generate_kem_keypair(req: PQCKeyPairRequest):
    """Genera par de llaves KEM post-cuánticas (Kyber/ML-KEM)"""
    pqc = get_pqc_service()
    return pqc.generate_kem_keypair(req.algorithm)

@api_router.post("/pqc/generate-signature-keypair")
async def generate_signature_keypair(req: PQCKeyPairRequest):
    """Genera par de llaves para firmas post-cuánticas (Dilithium/ML-DSA)"""
    pqc = get_pqc_service()
    return pqc.generate_signature_keypair(req.algorithm if req.algorithm in ["Dilithium2", "Dilithium3", "Dilithium5"] else "Dilithium3")

@api_router.post("/pqc/encapsulate")
async def encapsulate_secret(req: PQCEncapsulateRequest):
    """Encapsula un secreto compartido usando KEM post-cuántico"""
    pqc = get_pqc_service()
    return pqc.encapsulate(req.public_key, req.algorithm)

@api_router.post("/pqc/decapsulate")
async def decapsulate_secret(req: PQCDecapsulateRequest):
    """Decapsula un secreto compartido"""
    pqc = get_pqc_service()
    return pqc.decapsulate(req.ciphertext, req.secret_key, req.algorithm)

@api_router.post("/pqc/sign")
async def sign_message(req: PQCSignRequest):
    """Firma un mensaje con criptografía post-cuántica REAL (Dilithium)"""
    pqc = get_pqc_service()
    return pqc.sign(req.message, req.secret_key, req.algorithm)

@api_router.post("/pqc/verify")
async def verify_signature(req: PQCVerifyRequest):
    """Verifica una firma post-cuántica - VERIFICACIÓN CRIPTOGRÁFICA REAL"""
    pqc = get_pqc_service()
    return pqc.verify(req.message, req.signature, req.public_key, req.algorithm, req.binding_hash)

@api_router.post("/pqc/sign-tokenization")
async def sign_asset_tokenization(req: PQCTokenizeRequest):
    """Firma datos de tokenización de un activo con PQC"""
    pqc = get_pqc_service()
    return pqc.sign_asset_tokenization(req.asset_data, req.secret_key, req.algorithm)

@api_router.post("/pqc/verify-tokenization")
async def verify_asset_tokenization(req: PQCVerifyTokenRequest):
    """Verifica autenticidad de una tokenización"""
    pqc = get_pqc_service()
    return pqc.verify_asset_tokenization(req.asset_data, req.certificate, req.public_key)


# ============ KYC/AML ENDPOINTS ============

class SanctionsCheckRequest(BaseModel):
    name: str
    country_code: Optional[str] = None
    date_of_birth: Optional[str] = None

class KYCVerifyRequest(BaseModel):
    name: str
    country_code: Optional[str] = None
    document_type: str = "passport"
    document_number: Optional[str] = None
    date_of_birth: Optional[str] = None

class TransactionAnalysisRequest(BaseModel):
    id: Optional[str] = None
    amount_usd: float
    sender_country: Optional[str] = None
    receiver_country: Optional[str] = None

@api_router.post("/kyc/check-sanctions")
async def check_sanctions(req: SanctionsCheckRequest):
    """Verifica si una persona/entidad está en listas de sanciones"""
    kyc = get_kyc_aml_service()
    return await kyc.check_sanctions(req.name, req.country_code, req.date_of_birth)

@api_router.post("/kyc/verify-identity")
async def verify_identity(req: KYCVerifyRequest):
    """Verifica la identidad de un usuario (KYC completo)"""
    kyc = get_kyc_aml_service()
    user_data = {
        "name": req.name,
        "country_code": req.country_code,
        "document_type": req.document_type,
        "document_number": req.document_number,
        "date_of_birth": req.date_of_birth
    }
    return await kyc.verify_identity(user_data)

@api_router.post("/aml/analyze-transaction")
async def analyze_transaction(req: TransactionAnalysisRequest):
    """Analiza una transacción para detectar patrones AML sospechosos"""
    kyc = get_kyc_aml_service()
    transaction = {
        "id": req.id or str(uuid.uuid4()),
        "amount_usd": req.amount_usd,
        "sender_country": req.sender_country,
        "receiver_country": req.receiver_country
    }
    return kyc.analyze_transaction(transaction)

@api_router.get("/kyc/high-risk-countries")
async def get_high_risk_countries():
    """Lista países de alto riesgo según FATF/OFAC"""
    kyc = get_kyc_aml_service()
    return {
        "high_risk": kyc.HIGH_RISK_COUNTRIES,
        "grey_list": kyc.GREY_LIST_COUNTRIES,
        "updated_at": datetime.now(timezone.utc).isoformat()
    }


# Include router
app.include_router(api_router)

# CORS configuration - handle credentials properly
cors_origins_env = os.environ.get('CORS_ORIGINS', '*')
if cors_origins_env == '*':
    # For development/testing - allow all origins but without credentials
    cors_origins = ["*"]
    cors_allow_credentials = False
else:
    # For production - specific origins with credentials
    cors_origins = [origin.strip() for origin in cors_origins_env.split(',')]
    cors_allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_credentials=cors_allow_credentials,
    allow_origins=cors_origins,
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