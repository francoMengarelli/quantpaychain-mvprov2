# 🏗️ Revisión de Arquitectura - QuantPayChain

## 📊 Estado Actual del Sistema

### **Backend (Render.com)** ✅
- **URL**: `https://quantpaychain-api.onrender.com`
- **Status**: Operativo
- **AI Services**: Funcionando con Emergent LLM Key
- **Modelos**: gpt-4o-mini (Legal Advisor), gpt-4o (KYC/AML)

### **Frontend (Vercel)** ⚠️
- **URL**: Configurada con variable `NEXT_PUBLIC_API_URL`
- **Status**: Deployment en progreso
- **Issue**: Errores `indexedDB` durante build

### **Database (Supabase)** ✅
- **Tablas**: `rwa_assets`, `tokens`
- **RLS Policies**: Actualizadas para acceso público a assets activos
- **Status**: Operativo

---

## 🔄 Flujo Completo de Creación de Asset

### **1. Usuario Crea Asset (`/create-asset-v2`)**

**Input del formulario:**
```typescript
{
  name: string,              // Nombre del asset
  asset_type: string,        // Tipo (real_estate, commodity, etc.)
  description: string,       // Descripción detallada
  value_usd: number,         // Valor en USD
  location: string,          // Ubicación física
  token_name: string,        // ✅ NUEVO: Nombre del token
  token_symbol: string,      // Símbolo del token
  total_supply: number,      // Total de tokens
  price_per_token: number,   // Precio por token
  blockchain: string         // Red blockchain
}
```

**Backend Logic:**
1. Valida que el usuario esté autenticado
2. Crea registro en `rwa_assets`:
   ```sql
   INSERT INTO rwa_assets (
     id, owner_id, name, asset_type, description,
     value_usd, location, status
   ) VALUES (...)
   ```

3. Crea registro en `tokens`:
   ```sql
   INSERT INTO tokens (
     id, asset_id, token_name, token_symbol,
     total_supply, available_supply, price_per_token,
     blockchain_network
   ) VALUES (...)
   ```

**Expected Flow:**
- ✅ Asset creado → Status: `active`
- ✅ Token creado → `available_supply = total_supply`
- ✅ Redirige a `/dashboard`

---

### **2. Usuario Ve sus Assets (`/dashboard`)**

**Query a Supabase:**
```javascript
const { data } = await supabase
  .from('rwa_assets')
  .select('*')
  .eq('owner_id', user.id)
  .order('created_at', { ascending: false });
```

**Display:**
- Tarjetas con información del asset
- Stats: Total value, Total assets, Active assets
- Link a "Ver Detalles"

**Potential Issue:**
- ❌ Si RLS policies bloquean lectura de tokens → Error 406
- ✅ Solución: Ya ejecutamos `FIX_RLS_POLICIES.sql`

---

### **3. Usuario Ve el Marketplace (`/marketplace`)**

**Query con JOIN:**
```javascript
const { data } = await supabase
  .from('tokens')
  .select(`
    *,
    asset:rwa_assets!inner(name, asset_type, description, value_usd, location, status)
  `)
  .eq('asset.status', 'active')
  .gt('available_supply', 0);
```

**Display:**
- Grid de tokens disponibles
- Información del asset subyacente
- Botón "Ver Detalles" → `/token/[id]`

**Potential Issues:**
- ❌ Error 406 si RLS policies no permiten lectura
- ❌ Tokens no aparecen si `available_supply = 0`

---

### **4. Usuario Ve Detalles del Token (`/token/[id]`)**

**Query:**
```javascript
const { data } = await supabase
  .from('tokens')
  .select(`
    *,
    asset:rwa_assets!inner(*)
  `)
  .eq('id', tokenId)
  .single();
```

**Display:**
- Información completa del token
- Información del asset
- Botón "Comprar" (funcionalidad placeholder)

**Current Issue:**
- ❌ Error 404: No encuentra el token
- **Causas posibles:**
  1. Token no existe en DB
  2. RLS policy bloqueando lectura
  3. `tokenId` incorrecto

**Debug Steps:**
1. Verificar que el token se creó:
   ```sql
   SELECT * FROM tokens ORDER BY created_at DESC LIMIT 5;
   ```

2. Verificar que la política RLS permite lectura:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'tokens';
   ```

3. Verificar la URL del link en dashboard

---

## 🔧 Problemas Conocidos y Soluciones

### **Problema 1: `indexedDB is not defined` durante build** 🔴

**Causa:** 
- Supabase/Web3 intentan usar `indexedDB` durante SSG
- Next.js genera páginas estáticas durante build
- `indexedDB` solo existe en el navegador

**Soluciones Implementadas:**
1. ✅ Agregado `export const dynamic = 'force-dynamic'` en páginas
2. ✅ Agregado en `layout.tsx` para aplicar globalmente
3. ✅ Configurado Supabase para solo persistir sesión en navegador:
   ```typescript
   createClient(url, key, {
     auth: {
       persistSession: typeof window !== 'undefined',
       autoRefreshToken: typeof window !== 'undefined',
       detectSessionInUrl: typeof window !== 'undefined',
     },
   })
   ```

**Estado:** En prueba con deployment actual

---

### **Problema 2: Error 404 al ver token** 🔴

**Posibles Causas:**
1. **Token no se creó correctamente**
   - Verificar: ¿El insert en `tokens` fue exitoso?
   - Verificar: ¿El `asset_id` es correcto?

2. **RLS Policy bloqueando lectura**
   - Verificar: ¿Las políticas permiten lectura pública?
   - Ejecutar: `FIX_RLS_POLICIES.sql`

3. **URL incorrecta**
   - Verificar formato: `/token/[uuid-correcto]`
   - Verificar que el link en dashboard apunta al ID correcto

**Debug:**
```javascript
// En dashboard, verificar que el link es correcto:
console.log('Token ID:', asset.id);
console.log('Link:', `/token/${asset.id}`);
```

---

### **Problema 3: Frontend no muestra cambios** 🟡

**Causa:** Cache de Vercel o navegador

**Solución:**
1. Hard refresh: `Ctrl + Shift + R`
2. Modo incógnito
3. Limpiar cache de build en Vercel

---

## ✅ Checklist de Verificación Post-Deployment

### **Backend:**
- [x] AI Services funcionando
- [x] Endpoints respondiendo
- [x] Emergent LLM Key configurada

### **Frontend:**
- [ ] Build completa sin errores
- [ ] Páginas se renderizan dinámicamente (λ)
- [ ] No hay error `indexedDB` en logs

### **Database:**
- [x] RLS policies actualizadas
- [ ] Tokens se crean correctamente
- [ ] Queries funcionan sin error 406

### **Integration:**
- [ ] `NEXT_PUBLIC_API_URL` configurada
- [ ] Frontend puede llamar backend
- [ ] Flujo E2E funciona: Create Asset → Dashboard → Marketplace → Token Detail

---

## 🎯 Próximos Pasos Recomendados

### **Inmediato:**
1. ✅ Esperar deployment actual de Vercel
2. ⚠️ Verificar que el error `indexedDB` desaparezca
3. ⚠️ Probar flujo completo de creación de asset

### **Corto Plazo:**
1. Testing E2E con testing agent
2. Verificar todas las integraciones
3. Documentar cualquier issue encontrado

### **Mediano Plazo:**
1. Implementar servicios reales (PQC, ISO 20022, Stripe)
2. Mejorar manejo de errores
3. Añadir loading states

---

## 📞 Si el Problema Persiste

### **Error `indexedDB`:**
Considerar cambiar estrategia de renderizado:
- Convertir páginas problemáticas a Client Components puros
- Lazy load Supabase solo cuando sea necesario
- Usar `dynamic()` de Next.js para imports condicionales

### **Error 404 en tokens:**
1. Verificar en Supabase Dashboard que los tokens existen
2. Verificar en browser DevTools qué URL está intentando cargar
3. Verificar que el ID del token es válido UUID

### **Build fallando:**
1. Revisar versiones de dependencias
2. Verificar compatibilidad Next.js 14 con Supabase
3. Considerar actualizar a Next.js 15 (si es estable)
