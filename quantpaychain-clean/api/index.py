"""Vercel serverless function entry point for FastAPI backend"""
import sys
import os

# Add the apps/api directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'apps', 'api'))

from main import app

# Export the FastAPI app for Vercel
handler = app
