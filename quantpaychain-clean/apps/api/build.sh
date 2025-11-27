#!/bin/bash
# Build script for Render deployment

echo "🚀 Installing dependencies for QuantPayChain API..."

# Install emergentintegrations from custom index
pip install emergentintegrations --extra-index-url https://d33sy5i8bnduwe.cloudfront.net/simple/

# Install other requirements
pip install -r requirements.txt

echo "✅ Dependencies installed successfully!"