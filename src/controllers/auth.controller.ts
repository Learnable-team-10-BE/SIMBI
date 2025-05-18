import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ethers } from 'ethers';
import { Document } from 'mongoose';
import User from '../models/user';
import { generateWallet, encryptPrivateKey } from '../services/walletService';
import { updateUserLastStudyDate } from '../services/auth.service';
import { fundNewUser, fundLoginReward } from '../services/tokenService';
import { RegisterRequestBody, LoginRequestBody, WalletAuthRequest, IUser } from '../interfaces/auth.interface';

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { name, email, password, levelOfEducation } = req.body;

    // Validation logic remains the same
    if (!name || !email || !password || !levelOfEducation) {
      res.status(400).json({ 
        success: false,
        error: 'Missing required fields',
        details: {
          name: !name ? 'Name is required' : undefined,
          email: !email ? 'Email is required' : undefined,
          password: !password ? 'Password is required' : undefined,
          levelOfEducation: !levelOfEducation ? 'Level of education is required' : undefined
        }
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ 
        success: false,
        error: 'Password must be at least 6 characters long' 
      });
      return;
    }

    const validEducationLevels = ['secondary', 'university'];
    if (!validEducationLevels.includes(levelOfEducation)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid level of education',
        details: {
          levelOfEducation: `Must be one of: ${validEducationLevels.join(', ')}`
        }
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ 
        success: false,
        error: 'Email already registered' 
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { address: walletAddress, privateKey } = generateWallet();
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      levelOfEducation,
      walletAddress,
      privateKey: JSON.stringify(encryptedPrivateKey),
      externalWalletAddress: '',
      nonce: Math.floor(Math.random() * 1000000),
    });

    await user.save();

    try {
      await fundNewUser(walletAddress);
    } catch (fundError) {
      console.warn('Failed to fund new wallet:', fundError);
    }

    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '2h' }
    );

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      levelOfEducation: user.levelOfEducation,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(201).json({ 
      success: true,
      message: 'Registration successful',
      data: {
        user: userResponse,
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};
export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ 
        success: false,
        error: 'Email and password are required' 
      });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid email or password' 
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '1h' }
    );

    // Update last study date
    let updatedUser = user as unknown as Document & Omit<IUser, 'lastQuizDate'> & { lastQuizDate?: Date | null };
    try {
      updatedUser = await updateUserLastStudyDate(user.id.toString());
    } catch (error) {
      console.warn('Failed to update study date:', error);
    }

    // Format response safely
    const userResponse = {
      ...(updatedUser.toObject
        ? updatedUser.toObject() // Handle Mongoose documents
        : updatedUser),          // Handle plain objects (fallback)
      password: undefined,
      privateKey: process.env.PRIVATE_KEY ,
      externalWalletAddress: updatedUser.externalWalletAddress || undefined
    };

    // Send response first
    res.json({
      success: true,
      data: {
        token,
        user: userResponse,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak
      }
    });

    // Handle login reward after response
    try {
      await fundLoginReward(user.walletAddress);
    } catch (fundError) {
      console.warn('Failed to fund login reward:', fundError);
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};

export const generateNonce = async (req: Request, res: Response): Promise<void> => {
  try {
    const { externalWalletAddress } = req.query;
    
    if (!externalWalletAddress) {
      res.status(400).json({ 
        success: false,
        error: 'Wallet address required for nonce generation'
      });
      return;
    }

    const user = await User.findOne({ externalWalletAddress });
    const nonce = user?.nonce ?? Math.floor(Math.random() * 1000000);

    if (!user) {
      res.json({
        success: true,
        data: { nonce }
      });
      return;
    }

    res.json({
      success: true,
      data: {
        nonce: user.nonce,
        existingUser: !!user.email
      }
    });
  } catch (error) {
    console.error('Nonce generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const connectWallet = async (
  req: Request<{}, {}, WalletAuthRequest>,
  res: Response
): Promise<void> => {
  try {
    const { externalWalletAddress, signature, nonce } = req.body;

    if (!externalWalletAddress || !signature) {
      res.status(400).json({
        success: false,
        error: 'Wallet address and signature are required'
      });
      return;
    }

    const user = await User.findOne({ externalWalletAddress });
    const currentNonce = user?.nonce ?? nonce ?? Math.floor(Math.random() * 1000000);
    
    const message = `Welcome to Simbi AI!\n\nNonce: ${currentNonce}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== externalWalletAddress.toLowerCase()) {
      res.status(401).json({
        success: false,
        error: 'Invalid signature verification'
      });
      return;
    }

    const existingUser = await User.findOne({
      $or: [
        { externalWalletAddress },
        { walletAddress: externalWalletAddress }
      ]
    });

    if (existingUser && existingUser.externalWalletAddress !== externalWalletAddress) {
      res.status(409).json({
        success: false,
        error: 'Wallet already linked to another account'
      });
      return;
    }

    let authUser = existingUser;
    if (!authUser) {
      authUser = new User({
        externalWalletAddress,
        nonce: currentNonce,
        currentStreak: 0,
        longestStreak: 0,
        walletAddress: '',
        privateKey: '',
        achievements: []
      });

      await fundNewUser(externalWalletAddress);
    }

    authUser.nonce = Math.floor(Math.random() * 1000000);
    authUser.externalWalletAddress = externalWalletAddress;
    await authUser.save();

    const token = jwt.sign(
      { userId: authUser._id },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '1h' }
    );

    try {
      await fundLoginReward(externalWalletAddress);
    } catch (fundError) {
      console.warn('Login reward funding failed:', fundError);
    }

    res.json({
      success: true,
      data: {
        token,
        user: {
          ...authUser.toObject(),
          password: undefined,
          privateKey: undefined
        }
      }
    });
  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};