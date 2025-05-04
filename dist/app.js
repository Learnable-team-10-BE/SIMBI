"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_ts_1 = require("./config/database.ts");
const app = (0, express_1.default)();
(0, database_ts_1.connectDB)();
exports.default = app;
