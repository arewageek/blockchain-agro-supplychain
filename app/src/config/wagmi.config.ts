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
  address: "0x668dbd43A9d320df64a37f8ff9d0ea607E03818B",
  abi: farmSupplyChain.abi,
} as const;
