from fastapi import FastAPI, Request, Response, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import uuid

from routes import auth, assets, tokens, payments, reports, blockchains

load_dotenv()

app = FastAPI(
    title="QuantPay Chain API",
    description="Post-Quantum RWA Tokenization Platform API",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(assets.router, prefix="/api/assets", tags=["RWA Assets"])
app.include_router(tokens.router, prefix="/api/tokens", tags=["Tokens"])
app.include_router(payments.router, prefix="/api/payments", tags=["Payments"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports"])
app.include_router(blockchains.router, prefix="/api/blockchains", tags=["Blockchains"])

@app.get("/")
async def root():
    return {
        "name": "QuantPay Chain API",
        "version": "2.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
