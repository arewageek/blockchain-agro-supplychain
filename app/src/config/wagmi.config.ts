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
  address: "0x194E2170f1f81314E3264da7A4150384D9323B20",
  abi: farmSupplyChain.abi,
} as const;
