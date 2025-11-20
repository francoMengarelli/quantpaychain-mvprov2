from fastapi import APIRouter, HTTPException, Depends
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

class AssetCreate(BaseModel):
    name: str
    asset_type: str  # real_estate, commodity, invoice, other
    description: str
    value_usd: float
    metadata: Optional[dict] = {}

class Asset(BaseModel):
    id: str
    name: str
    asset_type: str
    description: str
    value_usd: float
    owner_id: str
    status: str
    blockchain_network: Optional[str] = None
    metadata: dict
    created_at: str

@router.post("/", response_model=Asset)
async def create_asset(asset: AssetCreate, user_id: str):
    """Create new RWA asset"""
    try:
        asset_data = {
            "id": str(uuid.uuid4()),
            "name": asset.name,
            "asset_type": asset.asset_type,
            "description": asset.description,
            "value_usd": asset.value_usd,
            "owner_id": user_id,
            "status": "active",
            "metadata": asset.metadata,
            "created_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("rwa_assets").insert(asset_data).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[Asset])
async def get_assets(
    asset_type: Optional[str] = None,
    blockchain: Optional[str] = None
):
    """Get all active assets with optional filters"""
    try:
        query = supabase.table("rwa_assets").select("*").eq("status", "active")
        
        if asset_type:
            query = query.eq("asset_type", asset_type)
        if blockchain:
            query = query.eq("blockchain_network", blockchain)
        
        result = query.execute()
        return result.data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str):
    """Get asset by ID"""
    try:
        result = supabase.table("rwa_assets").select("*").eq("id", asset_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Asset not found")
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
