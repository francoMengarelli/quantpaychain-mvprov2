"""
Test Integration Script - FastAPI + QPC Service

Simple FastAPI app to test the hybrid Python-TypeScript integration
without requiring full Supabase/Stripe credentials.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import only QPC routes (no dependencies on Supabase/Stripe)
from routes.qpc_advanced import router as qpc_router

app = FastAPI(
    title="QuantPayChain Test Integration",
    description="Testing Python-TypeScript Hybrid Architecture",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include QPC routes
app.include_router(qpc_router)

@app.get("/")
def root():
    return {
        "message": "QuantPayChain Test Integration API",
        "architecture": "Hybrid Python-TypeScript",
        "services": {
            "fastapi": "Python - Port 8001",
            "qpc_service": "Node.js TypeScript - Port 3001"
        },
        "docs": "/docs"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "fastapi-test",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
