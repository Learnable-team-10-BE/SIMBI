import { Contract } from "ethers";
import { adminSigner, tokenAddress, tokenABI } from "../config/ethers";

const simbi = new Contract(tokenAddress, tokenABI, adminSigner);

export const fundNewUser = async (userAddress: string) => {
  const tx = await simbi.fundNewUser(userAddress);
  return tx.wait();
};

export const fundLoginReward = async (userAddress: string) => {
  const tx = await simbi.fundLoginReward(userAddress);
  return tx.wait();
};