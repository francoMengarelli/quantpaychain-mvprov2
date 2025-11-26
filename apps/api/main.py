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
@app.post("/api/kyc/verify")
async def verify_kyc(request: KYCRequest):
    """
    Verifica KYC del usuario
    - Document verification
    - AML screening
    - Compliance checks
    """
    try:
        result = await kyc_service.verify_user(
            user_id=request.user_id,
            document_type=request.document_type,
            document_data=request.document_data
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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