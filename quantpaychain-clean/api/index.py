"""Vercel serverless function entry point for FastAPI backend"""
import sys
import os
from pathlib import Path

# Add the apps/api directory to the Python path
api_dir = Path(__file__).parent.parent / "apps" / "api"
sys.path.insert(0, str(api_dir))

from mangum import Mangum
from main import app

# Export handler for Vercel
handler = Mangum(app, lifespan="off")
