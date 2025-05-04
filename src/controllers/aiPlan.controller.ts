import { Request, Response, NextFunction } from "express";
import { generateAIStudyPlan } from "../services/aiPlan.service"; 

export default class AIPlanController {
  // Static method to handle AI-powered study plan generation
  static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { educationLevel, learningStyle, subject, goals } = req.body;

      if (!educationLevel || !learningStyle || !subject || !goals) {
        res.status(400).json({ message: "Missing required fields (educationLevel, learningStyle, subject, goals)" });
        return;
      }

      // Call the service to generate AI study plan using the Gemini API
      const aiResponse = await generateAIStudyPlan(
        educationLevel,
        learningStyle,
        subject,
        goals
      );

      // Respond with the generated study plan
      res.status(200).json({
        message: "AI-generated study plan",
        plan: aiResponse,
      });
    } catch (error) {
      console.error("AI plan generation error:", error);
      res.status(500).json({ message: "Failed to generate AI study plan" });
    }
  }
}

