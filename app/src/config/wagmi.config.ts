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
  address: "0xDAf22FC38858005aA9943ED20B4AcFC42518AE56",
  abi: farmSupplyChain.abi,
} as const;
