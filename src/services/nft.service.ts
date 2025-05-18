import { ethers } from 'ethers';
import {
  NFT_CONTRACT_ADDRESS,
  CONTRACT_ABI,
  signer
} from '../config/contract.config';

class NFTService {
  static async mintAchievement(
    userWallet: string,
    achievementType: number, // 0 = MathMaster, etc.
    tokenURI: string
  ): Promise<string> {
    if (!ethers.utils.isAddress(userWallet)) {
      throw new Error('Invalid wallet address');
    }

    try {
      const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.mintAchievementNFT(userWallet, achievementType, tokenURI);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('NFT minting failed:', error);
      throw new Error('Minting transaction failed');
    }
  }
}

export default NFTService;

