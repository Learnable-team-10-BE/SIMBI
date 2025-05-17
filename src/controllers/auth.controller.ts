import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { generateWallet, encryptPrivateKey } from '../services/walletService';
import { updateUserLastStudyDate } from '../services/auth.service';
import { RegisterRequestBody,LoginRequestBody } from '../interfaces/auth.interface';

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { name, email, password, levelOfEducation } = req.body;

    // Validate required fields
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid email format' 
      });
      return;
    }

    // Validate password strength
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
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '2h' }
    );

    // Remove sensitive data before sending response
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

    const updateUser = await updateUserLastStudyDate(user.id.toString());
    res.json({ token, user: updateUser || user,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak

    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  }
};