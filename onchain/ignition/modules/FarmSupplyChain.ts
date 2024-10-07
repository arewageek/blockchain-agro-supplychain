// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const fscModule = buildModule("fscModule", (m) => {
  const fsc = m.contract("FarmSupplyChain");

  return { fsc };
});

export default fscModule;
