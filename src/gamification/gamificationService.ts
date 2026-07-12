import { profileStorage, gamificationStorage, sessionStorage } from '../storage';
import { BADGES, type BadgeId } from '../models';
import { calculateXpGained } from '../scoring';
import type { ExerciseSession } from '../models';

export interface GamificationResult {
  xpGained: number;
  newBadges: BadgeId[];
  levelUp: boolean;
  newLevel: number;
  streakUpdated: boolean;
  newStreak: number;
  dailyGoalCompleted: boolean;
}

export const gamificationService = {
  async processSession(session: ExerciseSession): Promise<GamificationResult> {
    const { profileId, difficulty, score, totalItems, correctItems } = session;
    const avgTime = session.averageTimeMs;

    const xpGained = calculateXpGained(score, difficulty, avgTime);
    const statsBefore = await profileStorage.getStats(profileId);
    const statsAfter = await profileStorage.addExperience(profileId, xpGained);

    const levelUp = (statsBefore?.level ?? 1) < statsAfter.level;
    const newLevel = statsAfter.level;

    // Update stats
    const currentStats = await profileStorage.getStats(profileId);
    if (currentStats) {
      const updatedStats = {
        ...currentStats,
        totalExercises: currentStats.totalExercises + 1,
        totalCorrect: currentStats.totalCorrect + correctItems,
        totalAttempts: currentStats.totalAttempts + totalItems,
        totalTimeMs: currentStats.totalTimeMs + (session.completedAt ?? 0) - session.startedAt,
        lastSessionDate: Date.now(),
      };
      await profileStorage.updateStats(updatedStats);
    }

    // Streak
    const streak = await gamificationStorage.updateStreak(profileId);
    const streakUpdated = streak.lastDate === new Date().toISOString().slice(0, 10);

    // Daily goal
    const dailyGoal = await gamificationStorage.incrementDailyGoal(profileId);

    // Badges
    const newBadges: BadgeId[] = [];
    const sessionCount = await sessionStorage.countByType(profileId, session.type);

    const badgesToCheck: Array<{ id: BadgeId; condition: () => boolean }> = [
      { id: 'first_exercise', condition: () => sessionCount >= 1 },
      { id: 'streak_3', condition: () => streak.current >= 3 },
      { id: 'streak_7', condition: () => streak.current >= 7 },
      { id: 'streak_30', condition: () => streak.current >= 30 },
      { id: 'perfect_10', condition: () => score === 100 },
      { id: 'speed_reader', condition: () => avgTime < 2000 && correctItems >= 5 },
      { id: 'syllable_master', condition: () => session.type === 'syllables' && sessionCount >= 20 },
      { id: 'word_master', condition: () => session.type === 'words' && sessionCount >= 20 },
      { id: 'sentence_master', condition: () => session.type === 'sentences' && sessionCount >= 10 },
      { id: 'level_5', condition: () => newLevel >= 5 },
      { id: 'level_10', condition: () => newLevel >= 10 },
    ];

    for (const { id, condition } of badgesToCheck) {
      if (condition()) {
        const awarded = await gamificationStorage.awardBadge(profileId, id);
        if (awarded) newBadges.push(id);
      }
    }

    return {
      xpGained,
      newBadges,
      levelUp,
      newLevel,
      streakUpdated,
      newStreak: streak.current,
      dailyGoalCompleted: dailyGoal.completed && dailyGoal.completedExercises === dailyGoal.targetExercises,
    };
  },

  async getAvailableBadges() {
    return Object.values(BADGES);
  },
};
