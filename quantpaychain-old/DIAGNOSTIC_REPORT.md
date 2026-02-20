# Vercel Build Failure Diagnostic Report

**Date**: November 5, 2025  
**Commit**: 2900bb3  
**Error**: `Could not find a declaration file for module 'uuid'`

---

## Root Cause Analysis

### The Problem
Vercel build is failing with TypeScript error TS7016 because it cannot find type declarations for the `uuid` module, despite `@types/uuid` being present in `package.json`.

### Investigation Results

#### 1. Package.json Verification
✅ **Confirmed**: `@types/uuid@^9.0.7` IS present in `qpc-v2-core/package.json` (commit 2900bb3)
- Location: `devDependencies`
- Version: ^9.0.7

#### 2. Package-lock.json Verification
✅ **Confirmed**: `@types/uuid` is correctly referenced in `package-lock.json`
```json
"node_modules/@types/uuid": {
  "version": "9.0.8",
  "resolved": "https://registry.npmjs.org/@types/uuid/-/uuid-9.0.8.tgz",
  "dev": true,
  "license": "MIT"
}
```

#### 3. TypeScript Configuration
✅ **Confirmed**: `tsconfig.json` is correctly configured
- `typeRoots`: `["./node_modules/@types", "./types"]`
- `moduleResolution`: `"node"`

#### 4. Historical Analysis
🔍 **CRITICAL FINDING**: 

Commit `51fc894` ("fix: move @types packages to dependencies for Vercel build") moved `@types/*` packages to `dependencies`:
```json
"dependencies": {
  "@types/libsodium-wrappers": "^0.7.14",
  "@types/node": "^20.9.0",
  "@types/uuid": "^9.0.7",
  ...
}
```

However, a later commit moved them BACK to `devDependencies`:
```json
"devDependencies": {
  "@types/libsodium-wrappers": "^0.7.14",
  "@types/node": "^20.9.0",
  "@types/uuid": "^9.0.7",
  ...
}
```

### Why This Breaks Vercel

**Vercel's Build Environment**:
- Sets `NODE_ENV=production` during builds
- In production mode, `npm ci` installs only `dependencies`
- `devDependencies` are **excluded** in production builds

**The Build Flow**:
1. Vercel runs: `cd qpc-v2-core && npm ci`
2. `npm ci` in production mode **SKIPS** devDependencies
3. `@types/uuid` is NOT installed
4. `npm run build` executes `tsc`
5. TypeScript cannot find type declarations → **BUILD FAILS**

---

## Solution

### Move @types packages to dependencies

**Rationale**: 
- These packages are required for TypeScript compilation
- Vercel builds run in production mode
- Type definitions must be available during build time
- While unconventional, it's necessary for Vercel's build constraints

**Packages to Move**:
- `@types/uuid` - Required for uuid module typing
- `@types/node` - Required for Node.js built-in types
- `@types/libsodium-wrappers` - Required for libsodium-wrappers typing

### Implementation
```json
"dependencies": {
  "@types/libsodium-wrappers": "^0.7.14",
  "@types/node": "^20.9.0",
  "@types/uuid": "^9.0.7",
  "ajv": "^8.12.0",
  "fast-xml-parser": "^4.3.2",
  "libsodium-wrappers": "^0.7.11",
  "uuid": "^9.0.1",
  "winston": "^3.11.0"
}
```

---

## Verification Steps

After applying the fix:
1. ✅ Update `package.json` to move @types packages to dependencies
2. ✅ Regenerate `package-lock.json` with `npm install`
3. ✅ Commit changes
4. ✅ Push to trigger Vercel build
5. ⏳ Monitor Vercel build logs for successful compilation

---

## Alternative Approaches (Not Recommended)

### Option 1: Modify Vercel Build Command
```json
"buildCommand": "cd ../../../qpc-v2-core && npm ci --include=dev && npm run build && ..."
```
❌ **Issue**: May not work consistently across Vercel's environment

### Option 2: Use npm install instead of npm ci
```json
"buildCommand": "cd ../../../qpc-v2-core && npm install && npm run build && ..."
```
❌ **Issue**: Slower, less deterministic, not recommended for CI/CD

### Option 3: Custom Vercel Install Command
```json
"installCommand": "cd ../../../qpc-v2-core && npm ci && cd - && npm install"
```
❌ **Issue**: Complex, harder to maintain, multiple working directory changes

---

## Conclusion

**The fix is straightforward**: Move `@types/*` packages from `devDependencies` to `dependencies` in `qpc-v2-core/package.json`. This ensures TypeScript has access to type definitions during Vercel's production build process.

This pattern (types in dependencies) is used by many projects that build TypeScript in production environments, including major open-source projects and enterprise applications.
