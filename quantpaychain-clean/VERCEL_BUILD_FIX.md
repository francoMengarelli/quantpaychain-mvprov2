# Vercel Build Fix - Force Clean Build

**Status:** Fixes applied - waiting for Vercel to rebuild with commit e0518d2

## Problem
Vercel is using cached build that contains old code with `generateStaticParams` causing build failure:
```
Error: Page "/token/[id]/page" cannot use both "use client" and export function "generateStaticParams()".
```

## Root Cause
- The source code is already fixed (no `generateStaticParams` in `/token/[id]/page.tsx`)
- Vercel is restoring build cache: `Restored build cache from previous deployment (F5KgayqDFjkaUVDc27bnzQjdk4Ne)`
- The cache contains outdated build artifacts

## Solution Applied

### 1. Modified Web3Layout to use Dynamic Import (SSR: false)
**File:** `apps/web/app/(with-web3)/layout.tsx`
- Web3Provider now loads only on client-side using `next/dynamic` with `ssr: false`
- This prevents RainbowKit/Wagmi from trying to access browser APIs during build
- Added loading state for better UX

### 2. Updated next.config.js
**File:** `apps/web/next.config.js`
- Added `output: 'standalone'` to ensure proper deployment configuration
- Maintained webpack config for fallbacks and externals

### 3. Supabase Client Already Fixed
**File:** `apps/web/lib/supabase.ts`
- Already configured to handle SSR correctly
- Returns non-persistent client during server-side rendering
- Full features only on client-side

## How to Force Clean Build in Vercel

### Option 1: Via Vercel Dashboard (RECOMMENDED)
1. Go to your Vercel project dashboard
2. Navigate to Settings → General
3. Scroll to "Build & Development Settings"
4. Click "Redeploy" and check "Use existing Build Cache" to DISABLE it
5. Deploy

### Option 2: Via Git
1. Make a small change (like this file)
2. Commit and push to trigger new deployment
3. Vercel should detect changes and build fresh

### Option 3: Via Vercel CLI
```bash
vercel --force
```

### Option 4: Environment Variable Method
Add a temporary environment variable in Vercel dashboard to force rebuild:
- Key: `FORCE_REBUILD`
- Value: `1`

Then remove it after successful build.

## Expected Result
After clean build:
- ✅ Build should complete successfully
- ✅ No `generateStaticParams` errors
- ✅ Web3Provider loads only on client
- ✅ Supabase works correctly
- ✅ All pages accessible
- ✅ Dynamic routes work (`/token/[id]`)

## Verification Steps
1. Check build logs for successful completion
2. Visit homepage
3. Navigate to marketplace
4. Click on a token to view details
5. Check console for errors

## Next Steps After Successful Build
1. Test full flow: Create Asset → Dashboard → Detail
2. E2E testing with testing agent
3. Implement PQC service
4. Implement ISO 20022 service
