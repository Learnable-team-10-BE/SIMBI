import User from '../models/user.models'; 
import { IUser } from '../interfaces/auth.interface'; 
import { updateStreak } from '../utils/streak.utils';


export const updateUserLastStudyDate = async (userId: string): Promise<IUser | null> => {
  try {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found.`);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to the start of the day

  const currentStreak = user.currentStreak;
  const longestStreak = user.longestStreak;
  const lastStudyDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;

  if (lastStudyDate) {
      lastStudyDate.setHours(0, 0, 0, 0);   
  }

  const { newStreak, newLongestStreak } = updateStreak(currentStreak, longestStreak, lastStudyDate);

  user.lastStudyDate = new Date();
  user.currentStreak = newStreak;
  user.longestStreak = newLongestStreak;

  const updateUser = await user.save();
  return updateUser;
  } catch (error) {
    console.error (`Error updating streak for user ${userId}:`, error);
    throw new Error('Failed to update user streak');
  }
};
