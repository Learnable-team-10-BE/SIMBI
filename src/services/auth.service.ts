import User from '../models/user';
import { IUser } from '../interfaces/auth.interface';
import { updateStreak } from '../utils/streak.utils';
import { Document } from 'mongoose';

export const updateUserLastStudyDate = async (userId: string): Promise<Document & IUser> => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentStreak = user.currentStreak;
    const longestStreak = user.longestStreak;
    const lastStudyDate = user.lastStudyDate ? new Date(user.lastStudyDate) : null;

    if (lastStudyDate) {
      lastStudyDate.setHours(0, 0, 0, 0);
    }

    const { newStreak, newLongestStreak } = updateStreak(
      currentStreak,
      longestStreak,
      lastStudyDate
    );

    // Use findByIdAndUpdate for atomic update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        lastStudyDate: new Date(),
        currentStreak: newStreak,
        longestStreak: newLongestStreak
      },
      { new: true }
    ).select('-password -privateKey'); // Exclude sensitive fields

    if (!updatedUser) {
      throw new Error('Failed to update user study date');
    }

    return updatedUser as Document & IUser;
  } catch (error) {
    console.error(`Error updating streak for user ${userId}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update user streak');
  }
};