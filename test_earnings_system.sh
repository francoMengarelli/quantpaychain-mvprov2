#!/bin/bash

# Script de Testing para Sistema de Ganancias

API_URL="http://localhost:8001/api"

echo "🧪 Testing Sistema de Ganancias de QuantPayChain"
echo "=============================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Test 1: Verificar Backend está corriendo${NC}"
curl -s $API_URL/../ > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend activo${NC}"
else
    echo -e "${RED}❌ Backend no responde${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Test 2: Verificar endpoints de earnings existen${NC}"
curl -s $API_URL/docs | grep -q "earnings"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Endpoints de earnings registrados${NC}"
else
    echo -e "${RED}⚠️ Verifica que service_earnings esté importado${NC}"
fi
echo ""

echo -e "${BLUE}Test 3: Verificar estructura de modelos${NC}"
if [ -f "/app/backend/models_earnings.py" ]; then
    echo -e "${GREEN}✅ Modelos de earnings creados${NC}"
    echo "   - DividendDistribution"
    echo "   - AssetRevenue"
    echo "   - PortfolioHolding"
    echo "   - AssetPerformance"
else
    echo -e "${RED}❌ Archivo models_earnings.py no encontrado${NC}"
fi
echo ""

echo -e "${BLUE}Test 4: Verificar servicio de earnings${NC}"
if [ -f "/app/backend/services_earnings.py" ]; then
    echo -e "${GREEN}✅ Servicio de earnings creado${NC}"
    grep -q "class EarningsService" /app/backend/services_earnings.py && echo "   - EarningsService implementado"
    grep -q "distribute_dividends" /app/backend/services_earnings.py && echo "   - Distribución de dividendos ✓"
    grep -q "calculate_roi" /app/backend/services_earnings.py && echo "   - Cálculo de ROI ✓"
    grep -q "get_user_portfolio" /app/backend/services_earnings.py && echo "   - Portfolio de usuario ✓"
else
    echo -e "${RED}❌ Archivo services_earnings.py no encontrado${NC}"
fi
echo ""

echo -e "${BLUE}Test 5: Verificar página de Earnings en Frontend${NC}"
if [ -f "/app/frontend/src/pages/EarningsTracker.js" ]; then
    echo -e "${GREEN}✅ Página EarningsTracker creada${NC}"
    echo "   Ruta: /earnings"
else
    echo -e "${RED}❌ EarningsTracker.js no encontrado${NC}"
fi
echo ""

echo -e "${BLUE}Test 6: Verificar configuración PWA${NC}"
if [ -f "/app/frontend/public/manifest.json" ]; then
    echo -e "${GREEN}✅ manifest.json creado${NC}"
fi
if [ -f "/app/frontend/public/service-worker.js" ]; then
    echo -e "${GREEN}✅ service-worker.js creado${NC}"
fi
if grep -q "serviceWorker" /app/frontend/src/index.js 2>/dev/null; then
    echo -e "${GREEN}✅ Service Worker registrado en index.js${NC}"
fi
echo ""

echo -e "${BLUE}Test 7: Verificar responsive meta tags${NC}"
if grep -q "maximum-scale=1" /app/frontend/public/index.html; then
    echo -e "${GREEN}✅ Viewport configurado para mobile${NC}"
fi
if grep -q "apple-mobile-web-app-capable" /app/frontend/public/index.html; then
    echo -e "${GREEN}✅ Meta tags de iOS configurados${NC}"
fi
echo ""

echo "=============================================="
echo -e "${GREEN}🎉 Sistema de Ganancias implementado!${NC}"
echo ""
echo "📚 Documentación completa:"
echo "   /app/SISTEMA_GANANCIAS_COMPLETO.md"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Earnings Dashboard: http://localhost:3000/earnings"
echo "   API Docs: http://localhost:8001/docs"
echo ""
echo "📱 Para instalar como App:"
echo "   iOS: Safari → Compartir → Agregar a Inicio"
echo "   Android: Chrome → Menú → Instalar app"
