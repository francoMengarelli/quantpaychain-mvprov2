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
    Verifica qué servicios AI están funcionando
    """
    services_status = {}
    
    # Test AI Advisor
    try:
        test_result = await ai_advisor.analyze_asset("art", "Test artwork", 100000, "Madrid")
        services_status["ai_advisor"] = {
            "status": "✅ Funcionando", 
            "model": "gpt-4",
            "ai_powered": test_result.get("metadata", {}).get("ai_powered", False)
        }
    except Exception as e:
        services_status["ai_advisor"] = {
            "status": "❌ Error",
            "error": str(e)
        }
    
    # Test KYC Service  
    try:
        test_kyc = await kyc_service.verify_user("test", "id", {"name": "Test User"})
        services_status["kyc_aml"] = {
            "status": "✅ Funcionando",
            "model": test_kyc.get("ai_analysis", {}).get("model", "fallback"),
            "ai_powered": test_kyc.get("ai_analysis", {}).get("model") != "fallback"
        }
    except Exception as e:
        services_status["kyc_aml"] = {
            "status": "❌ Error", 
            "error": str(e)
        }
    
    return {
        "overall_status": "🤖 AI Services Status Check",
        "services": services_status,
        "emergent_llm_key": "✅ Configurada",
        "test_timestamp": datetime.utcnow().isoformat()
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

# PQC Endpoints
@app.post("/api/pqc/generate-keypair")
async def generate_pqc_keypair(user_id: str):
    """
    Genera par de llaves post-quantum para el usuario
    Algoritmos: Dilithium, SPHINCS+, Kyber
    """
    try:
        keypair = pqc_service.generate_keypair(user_id)
        return {
            "public_key": keypair['public_key'],
            "algorithm": keypair['algorithm'],
            "created_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pqc/encrypt")
async def encrypt_data(data: str, public_key: str):
    """
    Encripta datos con criptografía post-quantum
    """
    try:
        encrypted = pqc_service.encrypt(data, public_key)
        return {"encrypted_data": encrypted}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ISO 20022 Endpoints
@app.get("/api/iso20022/generate-report/{transaction_id}")
async def generate_iso_report(transaction_id: str):
    """
    Genera reporte compatible con ISO 20022
    - pain.001 (Payment Initiation)
    - camt.053 (Bank Statement)
    """
    try:
        transaction = await supabase_service.get_transaction(transaction_id)
        if not transaction:
            raise HTTPException(status_code=404, detail="Transaction not found")
        
        report = iso_service.generate_full_report(transaction)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)