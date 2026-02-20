
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// DISABLED FOR COMPILATION: import { PrismaAdapter } from '@next-auth/prisma-adapter';
// DISABLED FOR COMPILATION: import { prisma } from './db';
import bcrypt from 'bcryptjs';
import { SiweMessage } from 'siwe';

// DEMO MODE: No database adapter - using JWT sessions only
export const authOptions: NextAuthOptions = {
  // STUB: PrismaAdapter disabled - no database required for demo mode
  secret: process.env.NEXTAUTH_SECRET || 'demo-secret-change-in-production',
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // STUB: Database disabled - return mock user for demo
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: credentials.email,
          name: 'Demo User',
          walletAddress: null,
        };

        return mockUser;
      }
    }),
    CredentialsProvider({
      id: 'ethereum',
      name: 'Ethereum',
      credentials: {
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature) {
          return null;
        }

        try {
          const siweMessage = new SiweMessage(credentials.message);
          const fields = await siweMessage.verify({ signature: credentials.signature });

          if (!fields.success) {
            return null;
          }

          const walletAddress = siweMessage.address;

          // STUB: Database disabled - return mock user
          const mockUser = {
            id: 'wallet-user-' + Date.now(),
            email: `${walletAddress}@wallet.local`,
            name: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
            walletAddress,
          };

          return mockUser;
        } catch (error) {
          console.error('Ethereum auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          walletAddress: (token.walletAddress as string) || undefined,
        };
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};
