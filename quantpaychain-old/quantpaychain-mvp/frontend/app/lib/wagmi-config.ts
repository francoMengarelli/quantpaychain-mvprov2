
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'QuantPay Chain',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: [sepolia, mainnet, polygon],
  ssr: true,
});
