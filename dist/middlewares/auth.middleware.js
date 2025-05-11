"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const secret = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = { userId: decoded.userId, email: decoded.email };
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map