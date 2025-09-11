import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Staking DApp',
  projectId: '54ce9aeda9332fba67ac4617e6d7ac1e', // WalletConnect project ID
  chains: [sepolia],
  ssr: true,
});
