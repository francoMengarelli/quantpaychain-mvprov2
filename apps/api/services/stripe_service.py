import os
import stripe
from typing import Dict

class StripeService:
    """
    Stripe Payment Integration
    """
    
    def __init__(self):
        # TODO: Configurar con Stripe API key real
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_dummy")
    
    async def create_payment_intent(self, amount: float, currency: str = "usd", metadata: Dict = None):
        """
        Crea un payment intent
        """
        try:
            # Stripe usa centavos
            amount_cents = int(amount * 100)
            
            payment_intent = stripe.PaymentIntent.create(
                amount=amount_cents,
                currency=currency,
                metadata=metadata or {},
                automatic_payment_methods={"enabled": True}
            )
            return payment_intent
        except Exception as e:
            raise Exception(f"Stripe error: {str(e)}")
    
    async def get_payment_intent(self, payment_intent_id: str):
        """
        Obtiene detalles de un payment intent
        """
        try:
            return stripe.PaymentIntent.retrieve(payment_intent_id)
        except Exception as e:
            raise Exception(f"Stripe error: {str(e)}")
    
    async def create_customer(self, email: str, name: str):
        """
        Crea un customer en Stripe
        """
        try:
            return stripe.Customer.create(
                email=email,
                name=name
            )
        except Exception as e:
            raise Exception(f"Stripe error: {str(e)}")