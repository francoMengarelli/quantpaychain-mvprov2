#!/bin/bash

# Pre-Deployment Verification Script
# Verifica que todo esté listo para deployment

echo "🔍 Pre-Deployment Check - QuantPayChain"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print results
check_pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

check_warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

check_fail() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

check_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 BACKEND CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check backend files exist
if [ -f "/app/backend/server.py" ]; then
    check_pass "server.py existe"
else
    check_fail "server.py no encontrado"
fi

if [ -f "/app/backend/requirements.txt" ]; then
    check_pass "requirements.txt existe"
else
    check_fail "requirements.txt no encontrado"
fi

if [ -f "/app/backend/models_earnings.py" ]; then
    check_pass "models_earnings.py existe"
else
    check_warn "models_earnings.py no encontrado"
fi

if [ -f "/app/backend/services_earnings.py" ]; then
    check_pass "services_earnings.py existe"
else
    check_warn "services_earnings.py no encontrado"
fi

# Check backend env file
if [ -f "/app/backend/.env" ]; then
    check_pass ".env configurado"
    
    # Check key variables
    if grep -q "SUPABASE_URL" /app/backend/.env; then
        check_pass "SUPABASE_URL configurado"
    else
        check_warn "SUPABASE_URL falta en .env"
    fi
    
    if grep -q "EMERGENT_LLM_KEY" /app/backend/.env; then
        check_pass "EMERGENT_LLM_KEY configurado"
    else
        check_warn "EMERGENT_LLM_KEY falta en .env"
    fi
else
    check_warn ".env no encontrado (necesario para local)"
fi

# Check Python syntax
echo ""
check_info "Verificando sintaxis Python..."
cd /app/backend
python3 -m py_compile server.py 2>/dev/null
if [ $? -eq 0 ]; then
    check_pass "server.py - sintaxis correcta"
else
    check_fail "server.py - error de sintaxis"
fi

if [ -f "models_earnings.py" ]; then
    python3 -m py_compile models_earnings.py 2>/dev/null
    if [ $? -eq 0 ]; then
        check_pass "models_earnings.py - sintaxis correcta"
    else
        check_fail "models_earnings.py - error de sintaxis"
    fi
fi

if [ -f "services_earnings.py" ]; then
    python3 -m py_compile services_earnings.py 2>/dev/null
    if [ $? -eq 0 ]; then
        check_pass "services_earnings.py - sintaxis correcta"
    else
        check_fail "services_earnings.py - error de sintaxis"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 FRONTEND CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check frontend files
if [ -f "/app/frontend/package.json" ]; then
    check_pass "package.json existe"
else
    check_fail "package.json no encontrado"
fi

if [ -f "/app/frontend/src/App.js" ]; then
    check_pass "App.js existe"
else
    check_fail "App.js no encontrado"
fi

if [ -f "/app/frontend/src/pages/EarningsTracker.js" ]; then
    check_pass "EarningsTracker.js existe"
else
    check_warn "EarningsTracker.js no encontrado"
fi

# Check PWA files
if [ -f "/app/frontend/public/manifest.json" ]; then
    check_pass "manifest.json existe (PWA)"
else
    check_warn "manifest.json no encontrado"
fi

if [ -f "/app/frontend/public/service-worker.js" ]; then
    check_pass "service-worker.js existe (PWA)"
else
    check_warn "service-worker.js no encontrado"
fi

# Check if frontend builds
echo ""
check_info "Verificando build del frontend (puede tomar 30s)..."
cd /app/frontend
timeout 60 yarn build > /tmp/frontend-build.log 2>&1
if [ $? -eq 0 ]; then
    check_pass "Frontend compila exitosamente"
    
    # Check build size
    if [ -d "build" ]; then
        BUILD_SIZE=$(du -sh build | cut -f1)
        check_info "Tamaño del build: $BUILD_SIZE"
    fi
else
    check_fail "Frontend tiene errores de compilación"
    echo ""
    echo "Ver logs: tail /tmp/frontend-build.log"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 PWA & MOBILE CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check manifest.json validity
if [ -f "/app/frontend/public/manifest.json" ]; then
    python3 -m json.tool /app/frontend/public/manifest.json > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        check_pass "manifest.json es JSON válido"
    else
        check_fail "manifest.json tiene errores"
    fi
fi

# Check service worker registration
if grep -q "serviceWorker.register" /app/frontend/src/index.js; then
    check_pass "Service Worker está registrado"
else
    check_warn "Service Worker no está registrado"
fi

# Check viewport meta tag
if grep -q "viewport" /app/frontend/public/index.html; then
    check_pass "Viewport meta tag configurado"
else
    check_warn "Falta viewport meta tag"
fi

# Check apple mobile web app tags
if grep -q "apple-mobile-web-app-capable" /app/frontend/public/index.html; then
    check_pass "Meta tags de iOS configurados"
else
    check_warn "Faltan meta tags de iOS"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYMENT CONFIG CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Vercel config
if [ -f "/app/frontend/vercel.json" ]; then
    check_pass "vercel.json existe"
else
    check_warn "vercel.json no encontrado (se puede crear en Vercel)"
fi

# Check Render config
if [ -f "/app/backend/render.yaml" ]; then
    check_pass "render.yaml existe"
else
    check_warn "render.yaml no encontrado (se puede configurar en Render)"
fi

# Check for sensitive files that shouldn't be deployed
if [ -f "/app/backend/.env" ]; then
    if grep -q "\.env" /app/.gitignore 2>/dev/null; then
        check_pass ".env está en .gitignore"
    else
        check_warn ".env debería estar en .gitignore"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 TODO PERFECTO - LISTO PARA DEPLOYMENT${NC}"
    echo ""
    echo "Próximos pasos:"
    echo "1. Lee: /app/DEPLOYMENT_GUIDE_VERCEL_RENDER.md"
    echo "2. Deploy Backend en Render.com (5 min)"
    echo "3. Deploy Frontend en Vercel (3 min)"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  DEPLOYMENT POSIBLE CON $WARNINGS ADVERTENCIAS${NC}"
    echo ""
    echo "Puedes deployar, pero considera revisar las advertencias."
    echo ""
    echo "Próximos pasos:"
    echo "1. Lee: /app/DEPLOYMENT_GUIDE_VERCEL_RENDER.md"
    echo "2. Deploy Backend en Render.com"
    echo "3. Deploy Frontend en Vercel"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $ERRORS ERRORES CRÍTICOS - ARREGLAR ANTES DE DEPLOYMENT${NC}"
    echo -e "${YELLOW}   $WARNINGS ADVERTENCIAS${NC}"
    echo ""
    echo "Por favor, corrige los errores antes de deployar."
    echo ""
    exit 1
fi
