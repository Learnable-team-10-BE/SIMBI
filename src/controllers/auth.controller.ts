import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.models';
import { generateWallet, encryptPrivateKey } from '../services/walletService';
import { sendVerificationEmail } from '../services/emailService';
import { RegisterRequestBody, VerifyRequestBody, LoginRequestBody } from '../interfaces/auth.interface';

export const register = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  try {
    const { name, email, password, levelOfEducation } = req.body;

    if (!name || !email || !password || !levelOfEducation) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

    const validEducationLevels = ['secondary', 'university'];
    if (!validEducationLevels.includes(levelOfEducation)) {
      res.status(400).json({ error: 'Invalid level of education' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
    const { address: walletAddress, privateKey } = generateWallet();
    const encryptedPrivateKey = encryptPrivateKey(privateKey);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      levelOfEducation,
      walletAddress,
      privateKey: JSON.stringify(encryptedPrivateKey),
    });

    await user.save();
    await sendVerificationEmail(email, verificationToken);

    res.json({ message: 'Registration successful. Please check your email to verify.' });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Registration error: ${error.message}`);
    }
    throw new Error('Registration error: An unknown error occurred');
  }
};

export const verify = async (req: Request<{}, {}, VerifyRequestBody>, res: Response): Promise<void> => {
  try {
    const { email, verificationToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    if (user.verificationToken !== verificationToken) {
      res.status(400).json({ error: 'Invalid token' });
      return;
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Verification error: ${error.message}`);
    }
    throw new Error('Verification error: An unknown error occurred');
  }
};

export const login = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'User not found' });
      return;
    }

    if (!user.isVerified) {
      res.status(400).json({ error: 'Email not verified' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: 'Invalid password' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
    res.json({ token, userId: {id: user._id, email: user.email,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        streak: user.streak 
    }
     });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login error: ${error.message}`);
    }
    throw new Error('Login error: An unknown error occurred');
  }
};