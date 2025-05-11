import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables.");
}

export const genAI = new GoogleGenerativeAI(apiKey);
export const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash'
});

export const generationConfig: GenerationConfig = {
  responseMimeType: 'application/json',
  temperature: 0.7
};