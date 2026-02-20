# QuantPayChain Frontend - Deployment Guide

## Demo Mode (No Database Required)

This application is designed to work in **demo mode** without any database or external services. All features use simulated data when environment variables are not configured.

### Quick Deploy to Vercel

1. **Fork or clone this repository**
2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Import your repository
   - Click "Deploy"

3. **That's it!** The application will work immediately in demo mode.

### What Works in Demo Mode?

✅ **All UI features** - Full interface is functional
✅ **Authentication** - Mock user sessions (no persistence)
✅ **Document management** - Simulated document operations
✅ **Web3 wallet connection** - RainbowKit integration
✅ **Demo transactions** - Simulated blockchain interactions
✅ **Multi-language support** - English and Spanish

### Optional Configuration

The application works without any environment variables, but you can optionally configure:

#### NextAuth (Optional)
```bash
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"
```
*Note: If not provided, a default secret is used (not recommended for production)*

#### Database (Optional)
```bash
DATABASE_URL="postgresql://user:password@host:5432/database"
```
*Note: Not required for demo mode. All data is simulated.*

#### Web3 Configuration (Optional)
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project-id"
NEXT_PUBLIC_DOCUMENT_REGISTRY_SEPOLIA="0x..."
```

#### IPFS/Pinata (Optional)
```bash
PINATA_JWT="your-jwt-token"
NEXT_PUBLIC_PINATA_API_KEY="your-api-key"
```

### Vercel Environment Variables

To add environment variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add any optional variables you want to configure
4. Redeploy the application

### Troubleshooting

#### "Application error: a server-side exception has occurred"

This error typically means:
- ❌ Missing `NEXTAUTH_SECRET` in production
- ❌ Database connection attempted but `DATABASE_URL` not set

**Solution**: The latest version handles this gracefully. If you still see this error:
1. Set `NEXTAUTH_SECRET` in Vercel environment variables
2. Redeploy the application

#### Build Errors

If you encounter build errors:
1. Ensure you're using Node.js 18 or higher
2. Check that all dependencies are installed
3. Verify `next.config.js` is properly configured

### Production Deployment with Database

If you want to enable full functionality with database persistence:

1. **Set up PostgreSQL database** (e.g., on Vercel Postgres, Supabase, or Railway)
2. **Add environment variables**:
   ```bash
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secure-secret"
   ```
3. **Run Prisma migrations**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Uncomment database code** in:
   - `lib/db.ts`
   - `lib/auth-config.ts`
   - API routes

### Architecture

```
┌─────────────────────────────────────────┐
│         Next.js 14 App Router           │
├─────────────────────────────────────────┤
│  ✓ Server Components (RSC)              │
│  ✓ API Routes                           │
│  ✓ Middleware (Auth)                    │
└─────────────────────────────────────────┘
           │
           ├─── NextAuth (JWT Sessions)
           ├─── RainbowKit (Web3)
           ├─── Prisma (Optional DB)
           └─── Demo Mode (Simulated Data)
```

### Demo Mode vs Production Mode

| Feature | Demo Mode | Production Mode |
|---------|-----------|-----------------|
| User Authentication | ✅ Mock sessions | ✅ Persistent sessions |
| Document Storage | ✅ Simulated | ✅ IPFS/S3 |
| Database | ❌ Not required | ✅ PostgreSQL |
| Blockchain | ✅ Simulated | ✅ Real contracts |
| Multi-signature | ✅ Simulated | ✅ On-chain |

### Support

For issues or questions:
- Check the [main README](../../README.md)
- Review [API Documentation](../../docs/api-documentation.md)
- See [Demo Guide](../../docs/en/DEMO.md)

### Security Notes

⚠️ **Important for Production**:
- Always set a strong `NEXTAUTH_SECRET`
- Use environment-specific `.env` files
- Never commit `.env` files to version control
- Enable database for user data persistence
- Use proper authentication for API routes
- Implement rate limiting for production
