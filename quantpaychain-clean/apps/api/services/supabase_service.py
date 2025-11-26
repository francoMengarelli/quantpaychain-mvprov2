import os
from supabase import create_client, Client
from typing import Optional, Dict, List

class SupabaseService:
    """
    Supabase Database Service
    """
    
    def __init__(self):
        supabase_url = os.getenv("SUPABASE_URL")
        supabase_key = os.getenv("SUPABASE_SERVICE_KEY")  # Service role key for backend
        
        if not supabase_url or not supabase_key:
            raise Exception("Supabase credentials not configured")
        
        self.client: Client = create_client(supabase_url, supabase_key)
    
    async def get_token(self, token_id: str) -> Optional[Dict]:
        """
        Obtiene detalles de un token
        """
        result = self.client.table('tokens').select('*').eq('id', token_id).single().execute()
        return result.data if result.data else None
    
    async def update_token_supply(self, token_id: str, quantity: int):
        """
        Actualiza available_supply después de compra
        """
        # Get current supply
        token = await self.get_token(token_id)
        if not token:
            raise Exception("Token not found")
        
        new_supply = token['available_supply'] - quantity
        if new_supply < 0:
            raise Exception("Insufficient supply")
        
        result = self.client.table('tokens').update({
            'available_supply': new_supply
        }).eq('id', token_id).execute()
        
        return result.data
    
    async def create_transaction(self, buyer_id: str, token_id: str, quantity: int, total_amount: float, transaction_hash: str, status: str) -> Dict:
        """
        Crea registro de transacción
        """
        from uuid import uuid4
        from datetime import datetime
        
        transaction = {
            'id': str(uuid4()),
            'buyer_id': buyer_id,
            'token_id': token_id,
            'quantity': quantity,
            'total_amount': total_amount,
            'transaction_hash': transaction_hash,
            'status': status,
            'created_at': datetime.utcnow().isoformat()
        }
        
        result = self.client.table('transactions').insert(transaction).execute()
        return result.data[0] if result.data else None
    
    async def get_transaction(self, transaction_id: str) -> Optional[Dict]:
        """
        Obtiene detalles de una transacción
        """
        result = self.client.table('transactions').select('*').eq('id', transaction_id).single().execute()
        return result.data if result.data else None
    
    async def get_user_assets(self, user_id: str) -> List[Dict]:
        """
        Obtiene todos los assets de un usuario
        """
        result = self.client.table('rwa_assets').select('*').eq('owner_id', user_id).execute()
        return result.data if result.data else []
    
    async def get_active_tokens(self) -> List[Dict]:
        """
        Obtiene todos los tokens activos
        """
        result = self.client.table('tokens').select(`
            *,
            asset:rwa_assets!inner(name, asset_type, description, value_usd, location, status)
        `).eq('asset.status', 'active').gt('available_supply', 0).execute()
        return result.data if result.data else []