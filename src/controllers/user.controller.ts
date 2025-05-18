import { Request, Response } from 'express';
import { getWalletBalance } from '../services/tokenService';
import User from '../models/user';

export const getTokenBalance = async (req: Request, res: Response) => {
  try {
    // Get user from authentication middleware
    const userId = req.user?.userId;
    
    // Find user with wallet address
    const user = await User.findById(userId).select('walletAddress');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (!user.walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'No wallet associated with this account'
      });
    }

    // Get balance from blockchain
    const balance = await getWalletBalance(user.walletAddress);

    res.json({
      success: true,
      data: {
        balance,
        wallet: user.walletAddress,
        currency: 'SIMBI'
      }
    });

  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve balance',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};