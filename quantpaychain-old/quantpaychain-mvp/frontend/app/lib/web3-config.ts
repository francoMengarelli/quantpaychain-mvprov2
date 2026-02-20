
'use client';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  hardhat
} from 'wagmi/chains';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'quantpay-chain-mvp';

export const wagmiConfig = getDefaultConfig({
  appName: 'QuantPay Chain',
  projectId,
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    hardhat,
  ],
  ssr: true,
});

// Contract addresses
export const CONTRACTS = {
  DOCUMENT_REGISTRY: {
    [sepolia.id]: process.env.NEXT_PUBLIC_DOCUMENT_REGISTRY_SEPOLIA || '',
    [mainnet.id]: process.env.NEXT_PUBLIC_DOCUMENT_REGISTRY_MAINNET || '',
    [hardhat.id]: process.env.NEXT_PUBLIC_DOCUMENT_REGISTRY_LOCAL || '',
  },
};

// IPFS Configuration
export const IPFS_CONFIG = {
  PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY || '',
  PINATA_SECRET: process.env.NEXT_PUBLIC_PINATA_SECRET || '',
  PINATA_JWT: process.env.PINATA_JWT || '',
  GATEWAY_URL: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
};

export const PLAN_LIMITS = {
  FREE: 3,
  STARTER: 50,
  PROFESSIONAL: 500,
  BUSINESS: 2000,
  ENTERPRISE: -1, // unlimited
};
