import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RPC_URL || !process.env.ADMIN_PRIVATE_KEY || !process.env.SIMBI_TOKEN_ADDRESS) {
  throw new Error("Missing RPC_URL, ADMIN_PRIVATE_KEY, or SIMBI_TOKEN_ADDRESS in .env");
}

export const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
export const adminSigner = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
export const tokenAddress = process.env.SIMBI_TOKEN_ADDRESS;
export const tokenABI = [
  "function fundNewUser(address user)",
  "function fundLoginReward(address user)",
];