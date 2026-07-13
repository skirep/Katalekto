import syllablesSets from './syllables.json';
import wordsSets from './words.json';
import pseudowordsSets from './pseudowords.json';
import sentencesSets from './sentences.json';
import type { ExerciseSet, ExerciseType, Difficulty } from '../models';

const HARD_SYLLABLE_TARGET = 50;

function createHardSyllableSet(): ExerciseSet | null {
  const syllablePool = (syllablesSets as ExerciseSet[]).flatMap((set) => set.items);
  if (syllablePool.length === 0) return null;
  const items = Array.from({ length: HARD_SYLLABLE_TARGET }, (_, index) => {
    const source = syllablePool[index % syllablePool.length];
    return {
      ...source,
      id: `syl-hard-${index + 1}`,
      difficulty: 'hard' as const,
    };
  });
  return {
    id: 'syl-hard-50',
    title: 'Síl·labes difícils (50)',
    description: 'Repte de 50 síl·labes amb repeticions',
    type: 'syllables',
    difficulty: 'hard',
    items,
  };
}

const hardSyllableSet = createHardSyllableSet();

const allSets: ExerciseSet[] = [
  ...(syllablesSets as ExerciseSet[]),
  ...(hardSyllableSet ? [hardSyllableSet] : []),
  ...(wordsSets as ExerciseSet[]),
  ...(pseudowordsSets as ExerciseSet[]),
  ...(sentencesSets as ExerciseSet[]),
];

export function getAllSets(): ExerciseSet[] {
  return allSets;
}

export function getSetsByType(type: ExerciseType): ExerciseSet[] {
  return allSets.filter((s) => s.type === type);
}

export function getSetsByDifficulty(difficulty: Difficulty): ExerciseSet[] {
  return allSets.filter((s) => s.difficulty === difficulty);
}

export function getSetsByTypeAndDifficulty(type: ExerciseType, difficulty: Difficulty): ExerciseSet[] {
  return allSets.filter((s) => s.type === type && s.difficulty === difficulty);
}

export function getSetById(id: string): ExerciseSet | undefined {
  return allSets.find((s) => s.id === id);
}

export function shuffleItems<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
