"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_ts_1 = require("./config/database.ts");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
const app_1 = __importDefault(require("./app"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
const cron = require('node-cron');
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Middleware
app_1.default.use(express_1.default.json());
// Database connection
(0, database_ts_1.connectDB)();
// Routes
app_1.default.get('/', (req, res) => {
    res.send('Express app running on Render!');
});
// Health check endpoint for pinging
app_1.default.get('/health', (req, res) => {
    res.status(200).send('OK');
});
// Self-pinging function
const startPinging = () => {
    // Use the Render-provided URL or fallback to localhost for development
    const appUrl = process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    // Schedule ping every 10 seconds
    cron.schedule('*/10 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios.get(`${appUrl}/health`);
            console.log(`Ping successful at ${new Date().toISOString()}: ${response.status}`);
        }
        catch (error) {
            console.error(`Ping failed at ${new Date().toISOString()}: ${error.message}`);
        }
    }));
};
app_1.default.use('/api/auth', auth_routes_1.default);
// Swagger documentation
app_1.default.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Error handling
app_1.default.use(auth_middleware_1.default);
// Start server
const server = app_1.default.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation available at: ${PORT}/api-docs`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated');
    });
});
