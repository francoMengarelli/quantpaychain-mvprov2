# 🔍 DEBUG: Problema con OPENAI_API_KEY en Render

## Cambios Implementados

He modificado el código del backend para ayudar a diagnosticar por qué la API key de OpenAI no está funcionando en Render.

### 1. Nuevo Endpoint de Debug

He añadido un endpoint `/api/test/env-debug` que te mostrará:
- Qué variables de entorno están disponibles
- La longitud de cada variable (sin mostrar valores sensibles)
- Si los servicios AI tienen acceso a la key

### 2. Mejor Manejo de Errores

Los servicios AI ahora:
- NO lanzan excepciones si falta la API key
- Imprimen mensajes de debug en los logs
- Funcionan en modo fallback gracefully

### 3. Logs Mejorados

Los servicios ahora imprimen:
- ✅ Cuando la API key se carga correctamente
- ⚠️ Cuando la API key no está disponible
- 🔑 Cuando se está usando la API key para hacer llamadas

## Pasos para Desplegar en Render

### Opción 1: Push desde tu máquina local

```bash
# 1. Ve a tu repositorio local
cd /ruta/a/tu/quantpaychain-clean

# 2. Añade los cambios
git add .

# 3. Haz commit
git commit -m "Add debug endpoint and improve API key handling"

# 4. Push a tu repositorio
git push origin main
```

Render detectará el cambio automáticamente y desplegará la nueva versión.

### Opción 2: Push Manual (si Render está conectado a GitHub)

Si Render está conectado a tu repositorio de GitHub, solo necesitas hacer push:

```bash
git push origin main
```

## Después del Despliegue

### 1. Prueba el nuevo endpoint de debug:

```bash
curl https://quantpaychain-api.onrender.com/api/test/env-debug
```

Esto te dirá:
- ✅ Si `OPENAI_API_KEY` existe
- ✅ Cuántos caracteres tiene
- ✅ Si los servicios AI la cargaron correctamente

### 2. Revisa los logs de inicio en Render

Ve a la pestaña "Logs" en Render y busca estos mensajes al inicio del deployment:

- `✅ OPENAI_API_KEY loaded successfully (length: XX)` → ¡BIEN!
- `⚠️ WARNING: OPENAI_API_KEY not found` → Hay un problema

### 3. Prueba los servicios AI de nuevo:

```bash
# Test del status
curl https://quantpaychain-api.onrender.com/api/test/ai-status

# Test del advisor
curl -X POST https://quantpaychain-api.onrender.com/api/test/ai-advisor
```

## Posibles Problemas y Soluciones

### Problema 1: La variable está pero es incorrecta

**Síntoma:** El debug endpoint muestra que existe, pero `ai_powered: false`

**Solución:** 
1. Verifica que la API key sea válida en OpenAI Dashboard
2. Genera una nueva key
3. Actualízala en Render
4. **IMPORTANTE:** Después de cambiar variables, haz "Manual Restart" en Render

### Problema 2: La variable no existe

**Síntoma:** El debug endpoint muestra `exists: false`

**Solución:**
1. Ve a Render Dashboard → Tu servicio → Environment
2. Verifica que la variable se llame **exactamente** `OPENAI_API_KEY` (mayúsculas)
3. Asegúrate de hacer clic en "Save Changes"
4. Haz un "Manual Restart"

### Problema 3: La variable existe pero los servicios no la ven

**Síntoma:** Debug muestra `exists: true` pero `ai_services_keys: "NO KEY LOADED"`

**Solución:**
1. Puede ser un problema de timing en la inicialización
2. Haz un "Clear Build Cache & Deploy" en Render
3. Esto forzará una reconstrucción completa

## Estructura de la API Key

Una API key válida de OpenAI tiene este formato:
```
sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

- Empieza con `sk-proj-`
- Tiene aproximadamente 56-64 caracteres
- Solo contiene letras, números y guiones

## Siguiente Paso

Una vez que hagas el deployment con estos cambios, **comparte conmigo**:

1. La respuesta del endpoint `/api/test/env-debug`
2. Los logs de inicio del servicio en Render (primeras 50 líneas)

Con esa información podré decirte exactamente qué está fallando.

---

**Nota:** Estos cambios de debug NO afectan la funcionalidad del servicio. El backend seguirá funcionando normalmente en modo fallback hasta que resolvamos el problema de la API key.
