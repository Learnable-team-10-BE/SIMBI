import StudySession, { IStudySession } from "../models/studyplan";
import { Types } from "mongoose";

export default class StudySessionService {
  static async createSession(
    userId: string,
    data: {
      subject: string;
      topic: string;
      date: Date;
      time: string;
      duration: number;
    }
  ): Promise<IStudySession> {
    const session = new StudySession({ ...data, userId });
    return await session.save();
  }

  static async getUserSessions(userId: string, status?: string): Promise<IStudySession[]> {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }
    return await StudySession.find(query).sort({ date: 1 });
  }

  static async getSessionById(userId: string, sessionId: string): Promise<IStudySession | null> {
    if (!Types.ObjectId.isValid(sessionId)) return null;
    return await StudySession.findOne({ _id: sessionId, userId });
  }

  static async updateSession(
    userId: string,
    sessionId: string,
    updateData: Partial<IStudySession>
  ): Promise<IStudySession | null> {
    if (!Types.ObjectId.isValid(sessionId)) return null;
    return await StudySession.findOneAndUpdate(
      { _id: sessionId, userId },
      updateData,
      { new: true }
    );
  }

  static async deleteSession(userId: string, sessionId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(sessionId)) return false;
    const result = await StudySession.findOneAndDelete({ _id: sessionId, userId });
    return !!result;
  }
}
