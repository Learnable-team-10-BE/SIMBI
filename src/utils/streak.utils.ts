import { differenceInDays, startOfDay, endOfDay } from 'date-fns';

export const calculateStreak = (lastStudyDate: Date | null): number => {
  if (!lastStudyDate) {
    return 0; // No previous streak-eligible activity
  }

  const today = startOfDay(new Date());
  const lastStudyDay = startOfDay(lastStudyDate);

// if the last study day is today, the streak continues (handled in updateStreak)
  if (lastStudyDay.getTime() === today.getTime()) {
       // The streak is valid for today, the actual count is stored on the user
    return 0;   // Or return the user's current streak if you fetch it here

 
    }
  const diff = differenceInDays(today, lastStudyDay);
 if (diff === 1) {
// Studied yesterday, streak continues. The actual increment happens in updateStreak.
    return 1; // Indicates continuity from yesterday
  } else {
    return 0;  // Missed a day or more, streak is broken
  }
};

export const updateStreak = (currentStreak: number, longestStreak: number, lastStreakActivityDate: Date | null): { newStreak: number; newLongestStreak: number } => {
  const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
  
    const lastActivityDay = lastStreakActivityDate ? startOfDay(lastStreakActivityDate) : null;

    if (!lastActivityDay) {
        // First ever streak eligible activity
        return { newStreak: 1, newLongestStreak: 1 };
    }
     // Check if the last activity was already today
    if (lastActivityDay?.getTime() >= todayStart.getTime() && lastActivityDay.getTime() <= todayEnd.getTime()) {
    // Already recorded activity for today, streak doesn't change
        return { newStreak: currentStreak, newLongestStreak: longestStreak };
    }

    const diff = differenceInDays(todayStart, lastActivityDay);

    if (diff === 1) {
        // last activity was yesterday, streak continues
        const newStreak = currentStreak + 1;
        const newLongestStreak = Math.max(longestStreak, newStreak);
        return { newStreak, newLongestStreak };
    } else {
        //last activity was more than 1 day ago, streak is broken
        return { newStreak: 1, newLongestStreak: longestStreak };
         // Start a new streak of 
    }
};
