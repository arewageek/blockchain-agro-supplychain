import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  coinbaseWallet,
  injected,
  metaMask,
  walletConnect,
} from "wagmi/connectors";

export const configWagmi = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [
    metaMask(),
    coinbaseWallet(),
    // walletConnect({
    //   projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
    // }),
  ],
});
