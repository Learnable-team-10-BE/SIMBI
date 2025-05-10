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
        if (!name || !email || !password || !levelOfEducation) {
            res.status(400).json({ error: 'Missing fields' });
            return;
        }
        const validEducationLevels = ['secondary', 'university'];
        if (!validEducationLevels.includes(levelOfEducation)) {
            res.status(400).json({ error: 'Invalid level of education' });
            return;
        }
        const existingUser = await user_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ error: 'Email already registered' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const { address: walletAddress, privateKey } = (0, walletService_1.generateWallet)();
        const encryptedPrivateKey = (0, walletService_1.encryptPrivateKey)(privateKey);
        const user = new user_1.default({
            name,
            email,
            password: hashedPassword,
            isVerified: true,
            levelOfEducation,
            walletAddress,
            privateKey: JSON.stringify(encryptedPrivateKey),
        });
        await user.save();
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: 'Registration successful', token });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Registration error: ${error.message}`);
        }
        throw new Error('Registration error: An unknown error occurred');
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ error: 'Invalid password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Login error: ${error.message}`);
        }
        throw new Error('Login error: An unknown error occurred');
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map