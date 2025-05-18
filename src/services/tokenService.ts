import { Contract, ethers } from "ethers";
import { adminSigner, tokenAddress, tokenABI } from "../config/ethers";

const simbi = new Contract(tokenAddress, tokenABI, adminSigner);

// Existing funding functions
export const fundNewUser = async (userAddress: string) => {
  const tx = await simbi.fundNewUser(userAddress);
  return tx.wait();
};

export const fundLoginReward = async (userAddress: string) => {
  const tx = await simbi.fundLoginReward(userAddress);
  return tx.wait();
};

// New balance checking function
export const getWalletBalance = async (walletAddress: string): Promise<string> => {
  try {
    // Validate Ethereum address format
    if (!ethers.utils.isAddress(walletAddress)) {
      throw new Error('Invalid Ethereum address');
    }

    // Get raw balance from blockchain
    const balanceWei = await simbi.balanceOf(walletAddress);
    
    // Get token decimals (assuming 18 based on "ether" in your contract)
    const decimals = await simbi.decimals();
    
    // Convert to human-readable format
    return ethers.utils.formatUnits(balanceWei, decimals);
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to retrieve token balance');
  }
};