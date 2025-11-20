from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class CheckoutRequest(BaseModel):
    token_id: str
    quantity: int
    origin_url: str

@router.post("/checkout")
async def create_checkout(request: CheckoutRequest, user_id: str):
    """Create Stripe checkout session"""
    try:
        # Get token details (implement with Supabase)
        # For now, mock data
        
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': 5000,  # $50 in cents
                    'product_data': {
                        'name': 'RWA Token',
                    },
                },
                'quantity': request.quantity,
            }],
            mode='payment',
            success_url=f"{request.origin_url}/payment-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{request.origin_url}/marketplace",
            metadata={
                'user_id': user_id,
                'token_id': request.token_id,
                'quantity': str(request.quantity)
            }
        )
        
        return {"url": checkout_session.url, "session_id": checkout_session.id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/status/{session_id}")
async def get_payment_status(session_id: str):
    """Get payment status"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "amount_total": session.amount_total
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
