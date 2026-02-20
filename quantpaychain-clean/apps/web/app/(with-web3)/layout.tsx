'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Load Web3Provider only on client-side to avoid SSR/indexedDB issues
const Web3Provider = dynamic(
  () => import('@/providers/web3-provider').then((mod) => mod.Web3Provider),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading Web3...</div>
      </div>
    ),
  }
);

export default function Web3Layout({
  children,
}: {
  children: ReactNode;
}) {
  return <Web3Provider>{children}</Web3Provider>;
}
