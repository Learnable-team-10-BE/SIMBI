import { ethers } from 'ethers';
import dotenv from 'dotenv';
import abiJson from './abi/StudyAchievementsABI.json';
dotenv.config();

export const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS as string;
export const CONTRACT_ABI = abiJson; // Store your ABI here
export const PROVIDER_URL = process.env.SEPOLIA_RPC_URL as string;
export const MINTER_PRIVATE_KEY = process.env.MINTER_PK as string;

export const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
export const signer = new ethers.Wallet(MINTER_PRIVATE_KEY, provider);
