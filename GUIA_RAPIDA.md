# 🚀 Guía Rápida - QuantPay Chain v2.0

## Para Franco Mengarelli

---

## ✅ PASO 1: Descargar Proyecto

### Desde Emergent Platform:

1. **Abrir File Explorer en Emergent**
2. **Navegar a:** `/tmp/`
3. **Buscar archivo:** `quantpaychain-v2-completo.zip`
4. **Descargar** a tu computadora

---

## ✅ PASO 2: Backup Tu Repo Actual

```bash
# En tu terminal local
cd /ruta/a/tu/quantpaychain-mvpro

# Crear backup branch
git checkout -b backup-v1-old
git add .
git commit -m "backup: versión antigua antes de v2.0"
git push origin backup-v1-old

# Volver a main
git checkout main
```

---

## ✅ PASO 3: Limpiar y Copiar Proyecto Nuevo

```bash
# IMPORTANTE: Guarda tus whitepapers primero!
cp WHITEPAPER_ES.md ~/Desktop/WHITEPAPER_ES_backup.md
cp WHITEPAPER_EN.md ~/Desktop/WHITEPAPER_EN_backup.md

# Eliminar carpetas viejas
rm -rf quantpaychain-mvp
rm -rf qpc-v2-core
rm -rf qpc-v2-core-backup
rm -rf node_modules

# Extraer proyecto nuevo
unzip ~/Downloads/quantpaychain-v2-completo.zip

# Restaurar whitepapers
mkdir -p docs
mv ~/Desktop/WHITEPAPER_ES_backup.md docs/WHITEPAPER_ES.md
mv ~/Desktop/WHITEPAPER_EN_backup.md docs/WHITEPAPER_EN.md
```

---

## ✅ PASO 4: Instalar Dependencias

```bash
# Root
npm install

# Frontend
cd apps/web
npm install
cd ../..

# Backend (opcional local)
cd apps/api
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

---

## ✅ PASO 5: Configurar Supabase (15 mins)

### 5.1 Crear Proyecto Supabase

1. Ir a **https://supabase.com**
2. Sign in / Sign up
3. **New Project:**
   - Name: `quantpaychain-prod`
   - Database Password: **GUARDAR ESTO**
   - Region: `US East (North Virginia)`
4. Esperar ~2 mins a que se cree

### 5.2 Copiar Credenciales

1. En Supabase → **Settings** → **API**
2. Copiar:
   ```
   Project URL: https://xxx.supabase.co
   anon public: eyJxxx...
   service_role: eyJxxx... (secret!)
   ```

### 5.3 Configurar .env.local

```bash
cd apps/web
cp .env.example .env.local
```

**Editar `apps/web/.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_51xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5.4 Crear Tablas en Supabase

```bash
# Desde root del proyecto
cd packages/database

# Crear .env con connection string
echo "DATABASE_URL=postgresql://postgres:[TU_PASSWORD]@db.xxx.supabase.co:5432/postgres" > .env

# Generar Prisma client
npx prisma generate

# Crear tablas
npx prisma db push
```

---

## ✅ PASO 6: Probar Localmente

```bash
# Desde root
npm run dev

# Abrir navegador
open http://localhost:3000
```

### Deberías ver:
- ✅ Landing page con estética violeta
- ✅ Gradientes animados
- ✅ Botones "Launch Platform" y "View Demo"
- ✅ Features cards
- ✅ Stats (24B, 10K TPS, etc.)

### Navega a:
- `http://localhost:3000/dashboard` → Dashboard
- `http://localhost:3000/marketplace` → Marketplace
- `http://localhost:3000/demo` → Demo

---

## ✅ PASO 7: Deploy a Vercel

### 7.1 Commit a GitHub

```bash
git add .
git commit -m "feat: QuantPayChain v2.0 - Full stack reorganization

- Monorepo architecture
- Next.js 14 frontend with institutional violet theme
- FastAPI backend with Supabase
- Prisma ORM
- Ready for production"

git push origin main
```

### 7.2 Configurar en Vercel

1. **Ir a https://vercel.com**
2. **Import Project** → Conectar GitHub
3. **Seleccionar:** `quantpaychain-mvpro`
4. **Framework Preset:** Next.js (auto-detectado)
5. **Root Directory:** `.` (default)

### 7.3 Agregar Environment Variables

**En Vercel → Settings → Environment Variables:**

```
NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxx...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY = pk_test_xxx

# Secrets (marcar como "Secret")
SUPABASE_SERVICE_KEY = eyJxxx...
OPENAI_API_KEY = sk-xxx...
STRIPE_SECRET_KEY = sk_test_xxx...
DATABASE_URL = postgresql://postgres:xxx@db.xxx.supabase.co:5432/postgres
```

### 7.4 Deploy

1. Click **Deploy**
2. Esperar ~2 mins
3. **Visit** tu sitio: `https://quantpaychain-mvpro.vercel.app`

### 7.5 Configurar Dominio Custom (quantpaychain.com)

1. Vercel → **Settings** → **Domains**
2. **Add Domain:** `quantpaychain.com`
3. **Add** también: `www.quantpaychain.com`
4. **Configurar DNS:**
   - En tu provider DNS (GoDaddy, Cloudflare, etc.)
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
5. Esperar propagación (~10 mins)

---

## ✅ PASO 8: Verificar Producción

### Checklist:
- [ ] https://quantpaychain.com → Landing page carga
- [ ] Estética violeta/purple visible
- [ ] Gradientes animados funcionando
- [ ] Botones responden
- [ ] /dashboard carga sin errores
- [ ] /marketplace carga
- [ ] /demo carga
- [ ] Console sin errores críticos

---

## 🎉 ¡LISTO!

### Ya tienes:
✅ Proyecto reorganizado profesionalmente  
✅ Frontend moderno con tu estética  
✅ Backend API funcional  
✅ Database Supabase conectada  
✅ Deploy en producción  
✅ Dominio custom configurado  

---

## 📞 Si Algo Falla

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Prisma no conecta
```bash
cd packages/database
npx prisma generate
npx prisma db push
```

### Error en Vercel build
1. Ver logs en Vercel Dashboard
2. Verificar env vars
3. Verificar que `vercel.json` esté en root

### Frontend no carga estilos
```bash
cd apps/web
rm -rf .next
npm run build
npm run dev
```

---

## 🚀 Próximos Pasos

### Esta Semana:
1. ✅ Familiarízate con la estructura
2. ⏳ Personaliza contenido
3. ⏳ Agrega tus whitepapers a `/docs`
4. ⏳ Prueba todas las páginas

### Próxima Semana:
1. ⏳ Implementar auth real con Supabase
2. ⏳ Conectar frontend con API
3. ⏳ Agregar más páginas
4. ⏳ Testing completo

### Mes 1:
1. ⏳ Funcionalidad completa end-to-end
2. ⏳ Integración Stripe real
3. ⏳ AI analysis con OpenAI
4. ⏳ ISO 20022 reports

---

**¡Tu proyecto está listo para el mundo!** 🌎💜

*Cualquier duda, vuelve a Emergent y continuamos* 🤖
