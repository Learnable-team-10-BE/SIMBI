"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const walletService_1 = require("../services/walletService");
const register = async (req, res) => {
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
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'Email already registered'
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const { address: walletAddress, privateKey } = (0, walletService_1.generateWallet)();
        const encryptedPrivateKey = (0, walletService_1.encryptPrivateKey)(privateKey);
        const user = new user_1.default({
            name,
            email,
            password: hashedPassword,
            levelOfEducation,
            walletAddress,
            privateKey: JSON.stringify(encryptedPrivateKey),
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
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
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
            return;
        }
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({
                success: false,
                error: 'Invalid email or password'
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
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
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map