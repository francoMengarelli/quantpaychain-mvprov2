from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from supabase import create_client, Client
import os
import uuid
from datetime import datetime

router = APIRouter()

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

class TokenCreate(BaseModel):
    asset_id: str
    token_symbol: str
    total_supply: int
    price_per_token: float
    blockchain_network: str

class Token(BaseModel):
    id: str
    asset_id: str
    token_symbol: str
    total_supply: int
    available_supply: int
    price_per_token: float
    blockchain_network: str
    contract_address: str
    created_at: str

@router.post("/", response_model=Token)
async def create_token(token: TokenCreate, user_id: str):
    """Tokenize an RWA asset"""
    try:
        # Verify asset exists and user owns it
        asset_result = supabase.table("rwa_assets").select("*").eq("id", token.asset_id).eq("owner_id", user_id).execute()
        
        if not asset_result.data:
            raise HTTPException(status_code=404, detail="Asset not found or not owned by user")
        
        token_data = {
            "id": str(uuid.uuid4()),
            "asset_id": token.asset_id,
            "token_symbol": token.token_symbol,
            "total_supply": token.total_supply,
            "available_supply": token.total_supply,
            "price_per_token": token.price_per_token,
            "blockchain_network": token.blockchain_network,
            "contract_address": f"0x{uuid.uuid4().hex[:40]}",
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("tokens").insert(token_data).execute()
        
        # Update asset status
        supabase.table("rwa_assets").update({
            "status": "tokenized",
            "blockchain_network": token.blockchain_network
        }).eq("id", token.asset_id).execute()
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[Token])
async def get_tokens(blockchain: Optional[str] = None):
    """Get available tokens"""
    try:
        query = supabase.table("tokens").select("*").gt("available_supply", 0)
        
        if blockchain:
            query = query.eq("blockchain_network", blockchain)
        
        result = query.execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{token_id}", response_model=Token)
async def get_token(token_id: str):
    """Get token by ID"""
    try:
        result = supabase.table("tokens").select("*").eq("id", token_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Token not found")
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
