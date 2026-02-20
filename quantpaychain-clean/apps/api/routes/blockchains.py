from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Blockchain(BaseModel):
    id: str
    name: str
    symbol: str
    icon: str
    is_active: bool
    gas_fee_estimate: float

@router.get("/", response_model=List[Blockchain])
async def get_blockchains():
    """Get list of supported blockchains"""
    blockchains = [
        Blockchain(
            id="ethereum",
            name="Ethereum",
            symbol="ETH",
            icon="⟠",
            is_active=True,
            gas_fee_estimate=2.5
        ),
        Blockchain(
            id="polygon",
            name="Polygon",
            symbol="MATIC",
            icon="◆",
            is_active=True,
            gas_fee_estimate=0.01
        ),
        Blockchain(
            id="bsc",
            name="BNB Chain",
            symbol="BNB",
            icon="◉",
            is_active=True,
            gas_fee_estimate=0.1
        ),
        Blockchain(
            id="solana",
            name="Solana",
            symbol="SOL",
            icon="◎",
            is_active=True,
            gas_fee_estimate=0.00025
        ),
        Blockchain(
            id="avalanche",
            name="Avalanche",
            symbol="AVAX",
            icon="▲",
            is_active=True,
            gas_fee_estimate=0.5
        ),
        Blockchain(
            id="arbitrum",
            name="Arbitrum",
            symbol="ARB",
            icon="◭",
            is_active=True,
            gas_fee_estimate=0.1
        ),
    ]
    return blockchains
