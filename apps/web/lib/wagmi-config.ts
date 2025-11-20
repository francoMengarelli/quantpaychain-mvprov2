import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, polygonAmoy } from 'wagmi/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'QuantPay Chain',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    polygon,
    sepolia,
    polygonAmoy,
  ],
  ssr: true,
});
