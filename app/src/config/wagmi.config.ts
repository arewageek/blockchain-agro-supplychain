import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { coinbaseWallet, metaMask } from "wagmi/connectors";
import farmSupplyChain from "@/abi/FarmSupplyChain.json";

export const configWagmi = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [metaMask(), coinbaseWallet()],
  ssr: true,
});

export const contractConfig = {
  address: "0xAA6e88D0d1EdaBA2D71C7c23B9BEd26b535C6f7d",
  abi: farmSupplyChain.abi,
} as const;
