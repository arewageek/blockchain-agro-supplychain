import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";
import farmSupplyChain from "@/abi/FarmSupplyChain.json";

export const configWagmi = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
  connectors: [metaMask()],
  ssr: true,
});

export const contractConfig = {
  address: "0xDF9fBC64c0485E40EC5B2c446132b0c8E93736FA",
  abi: farmSupplyChain.abi,
} as const;
