
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string; // Adjust the type based on your application's user objec
      }     
    }
  }
}