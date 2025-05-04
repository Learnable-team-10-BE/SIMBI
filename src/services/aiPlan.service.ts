import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Function to generate an AI-powered study plan using Gemini
export const generateAIStudyPlan = async (educationLevel: string, learningStyle: string, subject: string, goals: string): Promise<string> => {
  try {
    // Construct the prompt for the Gemini API
    const prompt = `Create a personalized study plan for a student who is in ${educationLevel}, prefers a ${learningStyle} learning style, studying ${subject}, and has the following goal: ${goals}.`;

    // Call the Gemini API to generate the study plan
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Return the generated study plan text
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate AI study plan");
  }
};

