# Arreglo de Configuración de Despliegue en Vercel

## 📋 Resumen del Problema

El despliegue en Vercel estaba fallando con los siguientes errores:

```
sh: line 1: next: command not found
Error: Command 'next build' exited with 127
```

### Causa Raíz

El error ocurría porque Vercel intentaba ejecutar el comando `next build` desde la **raíz del repositorio**, pero:

1. **No existía un `package.json` en la raíz del repositorio**
2. El proyecto Next.js real está ubicado en el subdirectorio: `quantpaychain-mvp/frontend/app/`
3. Por lo tanto, las dependencias de Next.js no estaban instaladas y el comando `next` no estaba disponible

## 🔧 Cambios Realizados

### 1. Creación de `package.json` en la Raíz

Se creó un archivo `package.json` en la raíz del repositorio con:

```json
{
  "name": "quantpaychain-mvpro",
  "version": "1.0.0",
  "description": "QuantPay Chain - Protocolo post-cuántico para contratos digitales y sistemas de pago multi-moneda",
  "private": true,
  "scripts": {
    "dev": "cd quantpaychain-mvp/frontend/app && npm run dev",
    "build": "cd quantpaychain-mvp/frontend/app && npm run build",
    "start": "cd quantpaychain-mvp/frontend/app && npm run start",
    "postinstall": "cd quantpaychain-mvp/frontend/app && npm install"
  },
  "engines": {
    "node": "22.x"
  }
}
```

**Características clave:**
- **Scripts proxy**: Los scripts `dev`, `build` y `start` redirigen los comandos al subdirectorio correcto
- **Script `postinstall`**: Automáticamente instala las dependencias del proyecto Next.js cuando se ejecuta `npm install` en la raíz
- **Especificación de Node.js**: Define Node.js 22.x como la versión requerida

### 2. Creación de `vercel.json` en la Raíz

Se creó un archivo `vercel.json` en la raíz del repositorio para configurar el comportamiento de Vercel:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Características clave:**
- **Framework**: Especifica que es un proyecto Next.js
- **Comandos de build**: Utiliza los scripts definidos en el `package.json` de la raíz
- **Directorio de salida**: Define dónde Vercel encontrará los archivos compilados

## ✅ Cómo Funciona Ahora

### Flujo de Despliegue en Vercel

1. **Instalación de dependencias**:
   ```bash
   npm install  # En la raíz
   └─> postinstall script ejecuta: cd quantpaychain-mvp/frontend/app && npm install
   ```

2. **Build del proyecto**:
   ```bash
   npm run build  # En la raíz
   └─> Ejecuta: cd quantpaychain-mvp/frontend/app && npm run build
       └─> Ejecuta: next build  # Ahora funciona porque las dependencias están instaladas
   ```

3. **Start del servidor**:
   ```bash
   npm run start  # En la raíz
   └─> Ejecuta: cd quantpaychain-mvp/frontend/app && npm run start
       └─> Ejecuta: next start
   ```

## 🚀 Pasos Para el Nuevo Despliegue en Vercel

### Opción 1: Nuevo Despliegue (Recomendado)

1. **Accede a Vercel Dashboard**: https://vercel.com/dashboard
2. **Elimina el proyecto actual** (si existe) que estaba fallando
3. **Importa el proyecto nuevamente**:
   - Click en "Add New..." → "Project"
   - Selecciona el repositorio `quantpaychain-mvpro`
   - Vercel detectará automáticamente Next.js gracias al `vercel.json`
4. **Configuración del proyecto**:
   - **Framework Preset**: Next.js (debe detectarse automáticamente)
   - **Root Directory**: Dejar en `/` (raíz) - los archivos de configuración se encargarán del resto
   - **Build Command**: `npm run build` (o dejar el default)
   - **Install Command**: `npm install` (o dejar el default)
5. **Variables de entorno**: 
   - Configura las variables de entorno necesarias según `.env.example` en `quantpaychain-mvp/frontend/app/.env.example`
6. **Deploy**: Click en "Deploy"

### Opción 2: Reintento en el Proyecto Existente

1. **Accede al proyecto en Vercel**
2. **Ve a Settings** → **General**
3. **Verifica la configuración**:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `.next`
   - Root Directory: `/` (o dejarlo vacío)
4. **Forzar nuevo despliegue**:
   - Ve a "Deployments"
   - Click en "..." del último despliegue
   - Click en "Redeploy"

### Opción 3: Despliegue desde Vercel CLI (Alternativa)

```bash
# Instalar Vercel CLI
npm i -g vercel

# En la raíz del proyecto
cd /path/to/quantpaychain-mvpro

# Login
vercel login

# Desplegar
vercel --prod
```

## 📝 Notas Importantes

### Variables de Entorno Requeridas

Asegúrate de configurar en Vercel las siguientes variables de entorno (basadas en `.env.example`):

```env
# Base de datos
DATABASE_URL=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Blockchain / Wallet
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# AWS S3 (si se usa)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=

# Otras configuraciones necesarias...
```

### Estructura del Proyecto

```
quantpaychain-mvpro/
├── package.json              # ← NUEVO: Package.json de la raíz con scripts proxy
├── vercel.json               # ← NUEVO: Configuración de Vercel
├── VERCEL_FIX.md            # ← NUEVO: Este documento
├── WHITEPAPER_EN.md
├── WHITEPAPER_ES.md
└── quantpaychain-mvp/
    └── frontend/
        └── app/              # ← Proyecto Next.js real
            ├── package.json  # Package.json original con todas las dependencias
            ├── vercel.json   # Configuración específica del proyecto Next.js
            ├── next.config.js
            ├── app/
            ├── components/
            └── ...
```

### Mantenimiento del Código

- **Todo el código frontend** debe seguir siendo editado en `quantpaychain-mvp/frontend/app/`
- **Las dependencias** deben agregarse al `package.json` dentro de `quantpaychain-mvp/frontend/app/`
- Los archivos en la raíz (`package.json` y `vercel.json`) **solo actúan como puente** para el despliegue en Vercel

## 🎯 Próximos Pasos

1. ✅ **Código actualizado y pusheado** a GitHub (commit: `fix: Configuración de despliegue en Vercel`)
2. ⏳ **Configurar el despliegue en Vercel** siguiendo las instrucciones anteriores
3. ⏳ **Configurar las variables de entorno** en Vercel
4. ⏳ **Realizar el despliegue**
5. ⏳ **Verificar que el sitio funcione correctamente**

## 🐛 Resolución de Problemas

### Si el despliegue aún falla:

1. **Verifica los logs de build** en Vercel Dashboard
2. **Asegúrate de que todas las variables de entorno estén configuradas**
3. **Verifica que la versión de Node.js sea 22.x** en la configuración de Vercel
4. **Revisa el archivo `.gitignore`** para asegurar que los archivos necesarios no estén excluidos

### Comandos útiles para debug:

```bash
# En tu máquina local, prueba que el build funciona:
cd /path/to/quantpaychain-mvpro
npm install
npm run build

# Si funciona localmente pero falla en Vercel, es probablemente un problema de configuración de Vercel
```

## 📞 Soporte Adicional

Si sigues teniendo problemas con el despliegue:
1. Revisa la documentación oficial de Vercel: https://vercel.com/docs
2. Verifica que el repositorio en GitHub tenga los últimos cambios
3. Intenta hacer un nuevo despliegue limpio (eliminar el proyecto y volver a importarlo)

---

**Última actualización**: Octubre 11, 2025  
**Commit relacionado**: `097a99d - fix: Configuración de despliegue en Vercel`
