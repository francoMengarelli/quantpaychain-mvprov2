import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet, polygon, polygonAmoy } from 'wagmi/chains';

// Temporary project ID - replace with actual WalletConnect project ID
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

export const wagmiConfig = getDefaultConfig({
  appName: 'QuantPay Chain',
  projectId,
  chains: [
    mainnet,
    polygon,
    sepolia,
    polygonAmoy,
  ],
  ssr: true,
});
