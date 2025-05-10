import { Request } from "express";

declare global {
  namespace Express {
    interface User {
      userId: string;
      email?: string; // Add other properties as needed
    }

    interface Request {
      user?: User; // Make it optional
    }
  }
}