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
  address: "0x238bc070aD4dFC11aa0a29f73Da8C366fb13b26b",
  abi: farmSupplyChain.abi,
} as const;
