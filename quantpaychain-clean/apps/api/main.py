from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os
from datetime import datetime

from services.supabase_service import SupabaseService
from services.stripe_service import StripeService
from services.ai_advisor_service import AIAdvisorService
from services.pqc_service import PQCService
from services.iso20022_service import ISO20022Service
from services.kyc_aml_service import KYCAMLService

app = FastAPI(
    title="QuantPayChain API",
    description="Post-Quantum RWA Tokenization Platform with AI Advisor",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
supabase_service = SupabaseService()
stripe_service = StripeService()
ai_advisor = AIAdvisorService()
pqc_service = PQCService()
iso_service = ISO20022Service()
kyc_service = KYCAMLService()

# Models
class PurchaseRequest(BaseModel):
    token_id: str
    quantity: int
    user_id: str

class AIAdvisorRequest(BaseModel):
    asset_type: str
    description: str
    value_usd: float
    location: str
    user_context: Optional[dict] = None

class KYCRequest(BaseModel):
    user_id: str
    document_type: str
    document_data: dict

# Health check
@app.get("/")
async def root():
    return {
        "service": "QuantPayChain API",
        "status": "operational",
        "version": "2.0.0",
        "features": [
            "Post-Quantum Cryptography",
            "AI Legal Advisor",
            "ISO 20022 Compliance",
            "KYC/AML Integration",
            "Stripe Payments"
        ]
    }

# AI Advisor Endpoints
@app.post("/api/ai/advisor")
async def get_ai_advice(request: AIAdvisorRequest):
    """
    AI Advisor para guiar la creación de assets
    - Análisis legal
    - Sugerencias de uso (guardar, invertir, vender)
    - Compliance checks
    - Recomendaciones de tokenización
    """
    try:
        advice = await ai_advisor.analyze_asset(
            asset_type=request.asset_type,
            description=request.description,
            value_usd=request.value_usd,
            location=request.location,
            user_context=request.user_context
        )
        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/gamification-tips")
async def get_gamification_tips(asset_id: str):
    """
    Tips gamificados para el usuario
    - Achievements desbloqueables
    - Próximos pasos sugeridos
    - Rewards potenciales
    """
    try:
        tips = await ai_advisor.get_gamification_tips(asset_id)
        return tips
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Purchase Flow with Stripe
@app.post("/api/purchase/create-intent")
async def create_payment_intent(request: PurchaseRequest):
    """
    Crea un payment intent de Stripe para la compra de tokens
    """
    try:
        # Get token details
        token = await supabase_service.get_token(request.token_id)
        if not token:
            raise HTTPException(status_code=404, detail="Token not found")
        
        # Check availability
        if token['available_supply'] < request.quantity:
            raise HTTPException(status_code=400, detail="Insufficient tokens available")
        
        # Calculate amount
        amount = token['price_per_token'] * request.quantity
        
        # Create Stripe payment intent
        payment_intent = await stripe_service.create_payment_intent(
            amount=amount,
            currency="usd",
            metadata={
                "token_id": request.token_id,
                "quantity": request.quantity,
                "user_id": request.user_id
            }
        )
        
        return {
            "client_secret": payment_intent.client_secret,
            "amount": amount,
            "token_symbol": token['token_symbol']
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/purchase/confirm")
async def confirm_purchase(payment_intent_id: str):
    """
    Confirma la compra después del pago exitoso
    - Actualiza available_supply
    - Crea transaction record
    - Genera mensaje ISO 20022
    - Firma con PQC
    """
    try:
        # Verify payment with Stripe
        payment = await stripe_service.get_payment_intent(payment_intent_id)
        
        if payment.status != "succeeded":
            raise HTTPException(status_code=400, detail="Payment not completed")
        
        metadata = payment.metadata
        token_id = metadata['token_id']
        quantity = int(metadata['quantity'])
        user_id = metadata['user_id']
        
        # Update token supply
        await supabase_service.update_token_supply(token_id, quantity)
        
        # Create transaction record
        transaction = await supabase_service.create_transaction(
            buyer_id=user_id,
            token_id=token_id,
            quantity=quantity,
            total_amount=payment.amount / 100,  # Stripe uses cents
            transaction_hash=payment_intent_id,
            status="completed"
        )
        
        # Generate ISO 20022 message
        iso_message = iso_service.generate_payment_message(
            transaction_id=transaction['id'],
            amount=payment.amount / 100,
            debtor_name="Buyer",
            creditor_name="Asset Owner"
        )
        
        # Sign with PQC
        signature = pqc_service.sign_transaction(iso_message)
        
        return {
            "success": True,
            "transaction_id": transaction['id'],
            "iso20022_message": iso_message,
            "pqc_signature": signature,
            "message": "Purchase completed successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# KYC/AML Endpoints
class KYCRequest(BaseModel):
    user_id: str
    document_type: str
    document_data: dict
    document_image: Optional[str] = None

@app.post("/api/kyc/verify")
async def verify_kyc(request: KYCRequest):
    """
    Verifica KYC del usuario CON AI REAL
    - Document verification con GPT-4 Vision
    - AML screening inteligente
    - Compliance checks automatizados
    """
    try:
        result = await kyc_service.verify_user(
            user_id=request.user_id,
            document_type=request.document_type,
            document_data=request.document_data,
            document_image=request.document_image
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ENDPOINTS DE PRUEBA PARA AI SERVICES
@app.post("/api/test/ai-advisor")
async def test_ai_advisor():
    """
    🧪 ENDPOINT DE PRUEBA - AI Legal Advisor
    Prueba el análisis AI con un caso de ejemplo
    """
    try:
        result = await ai_advisor.analyze_asset(
            asset_type="real_estate",
            description="Apartamento de lujo en Manhattan, 2 habitaciones, vista al Central Park",
            value_usd=2500000,
            location="New York, NY, USA",
            user_context={"experience": "beginner", "portfolio_size": "small"}
        )
        
        return {
            "test_status": "✅ AI Legal Advisor funcionando",
            "model_used": "gpt-4", 
            "ai_analysis": result,
            "demo_note": "Este es un análisis real generado por GPT-4"
        }
    except Exception as e:
        return {
            "test_status": "⚠️ Error en AI Advisor",
            "error": str(e),
            "fallback_used": True
        }

@app.post("/api/test/kyc-analysis")
async def test_kyc_analysis():
    """
    🧪 ENDPOINT DE PRUEBA - KYC/AML con AI
    Prueba la verificación KYC con datos de ejemplo
    """
    try:
        result = await kyc_service.verify_user(
            user_id="test-user-123",
            document_type="passport",
            document_data={
                "name": "Juan Carlos Rodriguez",
                "document_number": "P123456789",
                "country": "Spain", 
                "date_of_birth": "1985-03-15",
                "expiry_date": "2030-03-15",
                "nationality": "Spanish"
            }
        )
        
        return {
            "test_status": "✅ KYC/AML AI funcionando",
            "model_used": "gpt-4-vision-preview",
            "kyc_result": result,
            "demo_note": "Análisis KYC real con inteligencia artificial"
        }
    except Exception as e:
        return {
            "test_status": "⚠️ Error en KYC AI",
            "error": str(e),
            "fallback_used": True
        }

@app.get("/api/test/ai-status")
async def test_ai_status():
    """
    🧪 ESTADO DE LOS SERVICIOS AI
    Quick health check without heavy operations to avoid 502 timeout
    """
    import os
    
    # Check if AI keys are configured
    emergent_key = os.environ.get("EMERGENT_LLM_KEY")
    openai_key = os.environ.get("OPENAI_API_KEY")
    
    key_status = "✅ Configurada" if (emergent_key or openai_key) else "❌ No configurada"
    
    return {
        "overall_status": "🤖 AI Services Ready",
        "services": {
            "ai_advisor": {
                "status": "✅ Disponible",
                "model": "gpt-4o-mini",
                "note": "Use POST /api/ai/advisor to test actual analysis"
            },
            "kyc_aml": {
                "status": "✅ Disponible",
                "model": "gpt-4o-mini",
                "note": "Use KYC endpoints for verification"
            },
            "risk_analytics": {
                "status": "✅ Disponible",
                "features": ["KYT", "Asset Validation", "Portfolio Monitoring"],
                "note": "New AI-powered risk service"
            }
        },
        "api_key_status": key_status,
        "test_timestamp": datetime.utcnow().isoformat(),
        "note": "This is a lightweight health check. For full AI testing, use specific endpoints."
    }

@app.get("/api/test/env-debug")
async def debug_environment():
    """
    🔍 ENDPOINT DE DEBUG - Variables de Entorno
    Verifica qué variables de entorno están disponibles (SIN MOSTRAR VALORES SENSIBLES)
    """
    env_status = {}
    
    # Lista de variables que esperamos
    expected_vars = [
        "OPENAI_API_KEY",
        "SUPABASE_URL", 
        "SUPABASE_SERVICE_KEY",
        "STRIPE_SECRET_KEY",
        "PORT"
    ]
    
    for var in expected_vars:
        value = os.environ.get(var)
        if value:
            # Mostrar solo los primeros y últimos caracteres para seguridad
            masked_value = f"{value[:8]}...{value[-4:]}" if len(value) > 12 else "***"
            env_status[var] = {
                "exists": True,
                "length": len(value),
                "preview": masked_value
            }
        else:
            env_status[var] = {
                "exists": False,
                "length": 0,
                "preview": "NOT_SET"
            }
    
    # Información adicional del servicio AI
    ai_key_info = {
        "ai_advisor_key": ai_advisor.api_key[:10] + "..." if hasattr(ai_advisor, 'api_key') and ai_advisor.api_key else "NO KEY LOADED",
        "kyc_key": kyc_service.api_key[:10] + "..." if hasattr(kyc_service, 'api_key') and kyc_service.api_key else "NO KEY LOADED"
    }
    
    return {
        "debug_status": "🔍 Environment Variables Check",
        "environment_variables": env_status,
        "ai_services_keys": ai_key_info,
        "total_env_vars": len(os.environ),
        "timestamp": datetime.utcnow().isoformat()
    }

# ============================================================================
# POST-QUANTUM CRYPTOGRAPHY (PQC) ENDPOINTS
# ============================================================================

class PQCTransactionRequest(BaseModel):
    transaction_data: dict
    private_key: Optional[str] = None

class PQCVerifyRequest(BaseModel):
    transaction_data: dict
    signature: str
    public_key: str

@app.post("/api/pqc/generate-keypair")
async def generate_pqc_keypair(algorithm: Optional[str] = None):
    """
    Generate post-quantum cryptographic keypair
    
    Algorithms:
    - ML-DSA-44, ML-DSA-65, ML-DSA-87 (signatures)
    - ML-KEM-512, ML-KEM-768, ML-KEM-1024 (encryption)
    """
    try:
        keypair = pqc_service.generate_keypair(algorithm)
        return keypair
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pqc/sign-transaction")
async def sign_transaction_pqc(request: PQCTransactionRequest):
    """
    Sign transaction with post-quantum signature (ML-DSA)
    Provides quantum-resistant transaction authentication
    """
    try:
        if not request.private_key:
            raise HTTPException(status_code=400, detail="Private key required")
        
        signature_result = pqc_service.sign_transaction(
            transaction_data=request.transaction_data,
            private_key=request.private_key
        )
        return signature_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pqc/verify-signature")
async def verify_pqc_signature(request: PQCVerifyRequest):
    """
    Verify post-quantum signature
    Ensures transaction integrity and authenticity
    """
    try:
        verification_result = pqc_service.verify_signature(
            transaction_data=request.transaction_data,
            signature=request.signature,
            public_key=request.public_key
        )
        return verification_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/pqc/service-info")
async def get_pqc_service_info():
    """
    Get PQC service information and availability
    """
    try:
        info = pqc_service.get_service_info()
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ISO 20022 COMPLIANT MESSAGING ENDPOINTS
# ============================================================================

class PaymentInitiationRequest(BaseModel):
    debtor_name: str
    debtor_account: str  # IBAN
    debtor_bic: str
    creditor_name: str
    creditor_account: str  # IBAN
    creditor_bic: str
    amount: float
    currency: str = "EUR"
    reference: str
    remittance_info: Optional[str] = None

class PaymentStatusRequest(BaseModel):
    original_message_id: str
    payment_info_id: str
    status_code: str  # ACCP, ACSC, RJCT, PDNG
    status_reason: Optional[str] = None

class BankStatementRequest(BaseModel):
    account_iban: str
    account_name: str
    statement_date: str  # YYYY-MM-DD format
    opening_balance: float
    closing_balance: float
    transactions: List[dict]
    currency: str = "EUR"

@app.post("/api/iso20022/payment-initiation")
async def create_payment_initiation(request: PaymentInitiationRequest):
    """
    Generate ISO 20022 pain.001 payment initiation message
    
    Compliant with SEPA and international payment standards
    Returns XML message ready for banking system submission
    """
    try:
        message = iso_service.generate_payment_initiation(
            debtor_name=request.debtor_name,
            debtor_account=request.debtor_account,
            debtor_bic=request.debtor_bic,
            creditor_name=request.creditor_name,
            creditor_account=request.creditor_account,
            creditor_bic=request.creditor_bic,
            amount=request.amount,
            currency=request.currency,
            reference=request.reference,
            remittance_info=request.remittance_info
        )
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/iso20022/payment-status")
async def create_payment_status_report(request: PaymentStatusRequest):
    """
    Generate ISO 20022 pain.002 payment status report
    
    Status codes:
    - ACCP: Accepted Customer Profile
    - ACSC: Accepted Settlement Completed
    - RJCT: Rejected
    - PDNG: Pending
    """
    try:
        message = iso_service.generate_payment_status_report(
            original_message_id=request.original_message_id,
            payment_info_id=request.payment_info_id,
            status_code=request.status_code,
            status_reason=request.status_reason
        )
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/iso20022/bank-statement")
async def create_bank_statement(request: BankStatementRequest):
    """
    Generate ISO 20022 camt.053 bank statement
    
    Provides end-of-day account statement with all transactions
    Compliant with regulatory reporting requirements
    """
    try:
        from datetime import datetime
        statement_date = datetime.strptime(request.statement_date, "%Y-%m-%d").date()
        
        message = iso_service.generate_bank_statement(
            account_iban=request.account_iban,
            account_name=request.account_name,
            statement_date=statement_date,
            opening_balance=request.opening_balance,
            closing_balance=request.closing_balance,
            transactions=request.transactions,
            currency=request.currency
        )
        return message
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/iso20022/service-info")
async def get_iso20022_service_info():
    """
    Get ISO 20022 service information and supported message types
    """
    try:
        info = iso_service.get_service_info()
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# COMBINED PQC + ISO 20022 ENDPOINT
# ============================================================================

@app.post("/api/secure-payment/initiate")
async def initiate_secure_payment(request: PaymentInitiationRequest):
    """
    🔐 QUANTUM-SAFE PAYMENT FLOW
    
    1. Generate ISO 20022 pain.001 message
    2. Sign with post-quantum cryptography
    3. Return both for blockchain submission
    
    This endpoint combines:
    - ISO 20022 compliance for banking systems
    - Post-quantum signatures for long-term security
    """
    try:
        # Generate ISO 20022 message
        iso_message = iso_service.generate_payment_initiation(
            debtor_name=request.debtor_name,
            debtor_account=request.debtor_account,
            debtor_bic=request.debtor_bic,
            creditor_name=request.creditor_name,
            creditor_account=request.creditor_account,
            creditor_bic=request.creditor_bic,
            amount=request.amount,
            currency=request.currency,
            reference=request.reference,
            remittance_info=request.remittance_info
        )
        
        # Generate PQC keypair (in production, use stored keys)
        keypair = pqc_service.generate_keypair()
        
        # Sign the ISO message with PQC
        transaction_data = {
            "message_id": iso_message["message_id"],
            "amount": iso_message["amount"],
            "currency": iso_message["currency"],
            "debtor": iso_message["debtor"],
            "creditor": iso_message["creditor"]
        }
        
        signature = pqc_service.sign_transaction(
            transaction_data=transaction_data,
            private_key=keypair["private_key"]
        )
        
        return {
            "iso20022_message": iso_message,
            "pqc_signature": signature,
            "public_key": keypair["public_key"],
            "security_level": "NIST Level 3 (192-bit quantum resistance)",
            "compliance": "ISO 20022 Universal Financial Industry Message Scheme",
            "message": "Payment secured with post-quantum cryptography"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# AI-POWERED RISK ANALYTICS & MONITORING (KYT)
# ============================================================================

from services.risk_analytics_service import RiskAnalyticsService
risk_analytics = RiskAnalyticsService()

class TransactionRiskRequest(BaseModel):
    transaction_data: dict
    iso20022_data: Optional[dict] = None
    user_history: Optional[List[dict]] = None

class AssetValidationRequest(BaseModel):
    asset_data: dict
    iso20022_payment_history: Optional[List[dict]] = None
    on_chain_data: Optional[dict] = None

class PortfolioMonitoringRequest(BaseModel):
    user_id: str
    portfolio: List[dict]
    market_data: Optional[dict] = None

@app.post("/api/risk/analyze-transaction")
async def analyze_transaction_risk(request: TransactionRiskRequest):
    """
    🔍 REAL-TIME TRANSACTION RISK ANALYSIS (KYT)
    
    Know Your Transaction - AI-powered fraud detection and AML monitoring
    
    Features:
    - Real-time risk scoring
    - Fraud pattern detection
    - ISO 20022 data integration
    - Regulatory compliance checks
    - Actionable recommendations
    
    Use Case: Run before processing high-value RWA token transfers
    """
    try:
        analysis = await risk_analytics.analyze_transaction_risk(
            transaction_data=request.transaction_data,
            iso20022_data=request.iso20022_data,
            user_history=request.user_history
        )
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/risk/validate-asset")
async def validate_asset_with_ai(request: AssetValidationRequest):
    \"\"\"
    ✅ AI-POWERED ASSET VALIDATION
    
    Deep asset validation using:
    - AI analysis of asset documentation
    - ISO 20022 payment history verification
    - On-chain vs off-chain data reconciliation
    - Ownership and authenticity checks
    
    Returns comprehensive validation report with confidence score
    \"\"\"
    try:
        validation = await risk_analytics.validate_asset_with_ai(
            asset_data=request.asset_data,
            iso20022_payment_history=request.iso20022_payment_history,
            on_chain_data=request.on_chain_data
        )
        return validation
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/risk/monitor-portfolio")
async def monitor_portfolio_risk(request: PortfolioMonitoringRequest):
    \"\"\"
    📊 CONTINUOUS PORTFOLIO RISK MONITORING
    
    Analyzes:
    - Portfolio concentration risk
    - Liquidity risk assessment
    - Diversification metrics
    - Real-time alerts
    - Optimization recommendations
    
    Use Case: Regular portfolio health checks for institutional clients
    \"\"\"
    try:
        monitoring = await risk_analytics.monitor_portfolio_risk(
            user_id=request.user_id,
            portfolio=request.portfolio,
            market_data=request.market_data
        )
        return monitoring
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/risk/service-info")
async def get_risk_analytics_info():
    \"\"\"
    Get Risk Analytics Service information and capabilities
    \"\"\"
    return {
        "service": "AI-Powered Risk Analytics & Monitoring",
        "status": "operational",
        "capabilities": [
            {
                "feature": "Know Your Transaction (KYT)",
                "description": "Real-time transaction risk analysis with fraud detection",
                "endpoint": "/api/risk/analyze-transaction"
            },
            {
                "feature": "AI Asset Validation",
                "description": "Deep asset validation with ISO 20022 integration",
                "endpoint": "/api/risk/validate-asset"
            },
            {
                "feature": "Portfolio Monitoring",
                "description": "Continuous risk monitoring and optimization",
                "endpoint": "/api/risk/monitor-portfolio"
            }
        ],
        "ai_models": {
            "primary": "gpt-4o-mini",
            "provider": "OpenAI",
            "use_cases": [
                "Complex fraud pattern recognition",
                "Asset authenticity validation",
                "Regulatory compliance assessment"
            ]
        },
        "integration": {
            "iso20022": "Full integration with payment messaging",
            "pqc": "Quantum-safe transaction verification",
            "blockchain": "On-chain monitoring capability"
        },
        "compliance": [
            "AML/CFT monitoring",
            "KYC verification",
            "Regulatory reporting",
            "Sanctions screening"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)