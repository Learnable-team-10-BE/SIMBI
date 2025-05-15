import StudySession from "../models/studyplan";

export const startSession = async (sessionId: string) => {
  const session = await StudySession.findById(sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  if (session.status === "active") {
    throw new Error("Session is already active");
  }

  session.status = "active";
  session.actualStartTime = new Date(); // timestamp for when user starts
  session.actualStartTime = session.actualStartTime || new Date(); // set once on first start
  await session.save();
  return session;
};

export const pauseSession = async (sessionId: string) => {
  const session = await StudySession.findById(sessionId);
  if (!session || session.status !== "active") {
    throw new Error("Session not active or not found");
  }

  const now = new Date();
  const elapsed = (now.getTime() - session.actualStartTime.getTime()) / 1000;
  session.totalElapsedTime += elapsed;
  session.status = "paused";
  await session.save();
  return session;
};

export const resumeSession = async (sessionId: string) => {
  const session = await StudySession.findById(sessionId);
  if (!session || session.status !== "paused") {
    throw new Error("Session not paused or not found");
  }

  session.status = "active";
  session.actualStartTime = new Date();
  await session.save();
  return session;
};

export const completeSession = async (sessionId: string) => {
  const session = await StudySession.findById(sessionId);
  if (
    !session ||
    (session.status !== "active" && session.status !== "paused")
  ) {
    throw new Error("Session not in progress or not found");
  }

  if (session.status === "active") {
    const now = new Date();
    const elapsed = (now.getTime() - session.actualStartTime.getTime()) / 1000;
    session.totalElapsedTime += elapsed;
  }

  session.status = "completed";
  session.actualEndTime = new Date();
  await session.save();
  return session;
};
