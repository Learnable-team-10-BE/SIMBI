import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as resourceService from "../services/studyResource.service";

export const uploadResource = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    console.log("🟡 req.body:", req.body);
    console.log("🟢 req.file:", req.file);

    const { sessionId, title, format, url } = req.body;
    const userId = req.user?.userId;
    const filePath = req.file?.path;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const resource = await resourceService.uploadResource(
      userId,
      sessionId,
      title,
      format,
      url,
      filePath
    );

    res.status(201).json(resource);
  } catch (err: any) {
    console.error(" Upload Error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

export const getSessionResources = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { sessionId } = req.params;
    const resources = await resourceService.getResourcesBySession(sessionId);
    res.json(resources);
  } catch (err: any) {
    console.error(" Error:", err);
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
