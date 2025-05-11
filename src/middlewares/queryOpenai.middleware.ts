import OpenAI from "openai";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";


dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
