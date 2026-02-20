#!/bin/bash

# QuantPayChain Hybrid Services Startup Script
# Starts both FastAPI (Python) and QPC Service (Node.js)

set -e

echo "🚀 Starting QuantPayChain Hybrid Services..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0;m' # No Color

# Start QPC Service (Node.js)
echo -e "${BLUE}Starting QPC Service (TypeScript Core)...${NC}"
cd /app/quantpaychain-clean/apps/qpc-service
node dist/server.js > /var/log/qpc-service.log 2>&1 &
QPC_PID=$!
echo -e "${GREEN}✅ QPC Service started (PID: $QPC_PID)${NC}"
echo "   Port: 3001"
echo ""

# Wait for QPC service to be ready
echo "Waiting for QPC Service to be ready..."
for i in {1..10}; do
  if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ QPC Service is ready${NC}"
    break
  fi
  sleep 1
done
echo ""

# Start FastAPI (Python)
echo -e "${BLUE}Starting FastAPI Backend (Python)...${NC}"
cd /app/quantpaychain-clean/apps/api
export QPC_SERVICE_URL="http://localhost:3001"
uvicorn main:app --host 0.0.0.0 --port 8001 > /var/log/fastapi.log 2>&1 &
FAST_PID=$!
echo -e "${GREEN}✅ FastAPI started (PID: $FAST_PID)${NC}"
echo "   Port: 8001"
echo ""

echo -e "${GREEN}🎉 All services started successfully!${NC}"
echo ""
echo "Service URLs:"
echo "  - FastAPI (Python):     http://localhost:8001"
echo "  - QPC Service (Node.js): http://localhost:3001"
echo "  - API Docs:             http://localhost:8001/docs"
echo ""
echo "To stop services:"
echo "  kill $QPC_PID $FAST_PID"
echo ""
echo "Logs:"
echo "  - QPC Service: /var/log/qpc-service.log"
echo "  - FastAPI:     /var/log/fastapi.log"
echo ""

# Keep script running
wait
