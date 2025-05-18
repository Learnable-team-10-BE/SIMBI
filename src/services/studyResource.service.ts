import { StudyResource } from '../models/studyResource.model';

export const uploadResource = async (
  userId: string,
  sessionId: string,
  title: string,
  format: string,
  url: string,
  filePath?: string
) => {
  return await StudyResource.create({ userId, sessionId, title, format, url, filePath });
};

export const getResourcesBySession = async (sessionId: string) => {
  return await StudyResource.find({ sessionId });
};

