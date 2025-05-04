import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import StudySessionService from "../services/studyPlan.service";

export default class StudySessionController {
  // Create a new study session
  static async createSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;  // Access userId from req.user
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
        return;
      }
      const session = await StudySessionService.createSession(userId, req.body);
      res.status(201).json({ message: "Study session created", session });
    } catch (error) {
      console.error("Error creating study session:", error);
      next(error); 
    }
  }

  // Get all study sessions for the user (optionally filtered by status)
  static async getUserSessions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
      }
      const { status } = req.query;
      const sessions = await StudySessionService.getUserSessions(userId as string, status as string);
      res.status(200).json({ sessions });
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      next(error);  
    }
  }

  // Get a specific study session by ID
  static async getSessionById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
      }
      const { id } = req.params;
      const session = await StudySessionService.getSessionById(userId as string, id);
      if (!session) {
        res.status(404).json({ message: "Session not found" });
      }
      res.status(200).json({ session });
    } catch (error) {
      console.error("Error retrieving study session:", error);
      next(error);  
    }
  }

  // Update a specific study session by ID
  static async updateSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
      }
      const { id } = req.params;
      const updated = await StudySessionService.updateSession(userId as string, id, req.body);
      if (!updated) {
        res.status(404).json({ message: "Session not found or not updated" });
      }
      res.status(200).json({ message: "Session updated", session: updated });
    } catch (error) {
      console.error("Error updating session:", error);
      next(error);  
    }
  }

  // Delete a specific study session by ID
  static async deleteSession(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
      }
      const { id } = req.params;
      const deleted = await StudySessionService.deleteSession(userId as string, id);
      if (!deleted) {
        res.status(404).json({ message: "Session not found or not deleted" });
      }
      res.status(200).json({ message: "Session deleted" });
    } catch (error) {
      console.error("Error deleting session:", error);
      next(error);  
    }
  }
}
