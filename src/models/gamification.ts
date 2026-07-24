import type { Difficulty, ExerciseType } from './exercise';

/**
 * Gamification model: badges, Pokémon rewards, daily goals and streaks.
 *
 * Achievement flow overview
 * ─────────────────────────
 * 1. After every exercise session the gamificationService evaluates which
 *    badges the player has newly earned.
 * 2. A badge is awarded at most once per profile.  The set of eligible badges
 *    is defined by BADGES and the unlock conditions are checked in
 *    gamificationService.processSession().
 * 3. Pokémon are now tied to explicit exercise paths:
 *    - each Pokémon has one or more assigned exercise sets
 *    - completing those sets increases its progress and battle power
 *    - more advanced exercise groups yield stronger Pokémon
 */

export type BadgeId =
  | 'first_exercise'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'perfect_10'
  | 'speed_reader'
  | 'syllable_master'
  | 'word_master'
  | 'sentence_master'
  | 'level_5'
  | 'level_10';

export interface Badge {
  id: BadgeId;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface ProfileBadge {
  profileId: string;
  badgeId: BadgeId;
  earnedAt: number;
}

export type PokemonExerciseType = Exclude<ExerciseType, 'pseudowords'>;

export interface PokemonPath {
  pathId: string;
  pokemonId: number;
  fallbackName: string;
  exerciseType: PokemonExerciseType;
  difficulty: Difficulty;
  setIds: string[];
  basePower: number;
  description: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface PokemonCollectionItem extends PokemonPath, PokemonDetails {
  unlocked: boolean;
  unlockCondition: string;
  assignedExerciseTitles: string[];
  completedSetIds: string[];
  completedSessions: number;
  progressPercent: number;
  bestScore: number;
  power: number;
}

export interface DailyGoal {
  profileId: string;
  date: string;
  targetExercises: number;
  completedExercises: number;
  completed: boolean;
}

export interface Streak {
  profileId: string;
  current: number;
  longest: number;
  lastDate: string;
}

/** Full catalogue of streak and mastery badges displayed on the Badges page. */
export const BADGES: Record<BadgeId, Badge> = {
  first_exercise: {
    id: 'first_exercise',
    name: 'Primer Pas',
    description: 'Has completat el teu primer exercici!',
    icon: '⭐',
    condition: 'Completa 1 exercici',
  },
  streak_3: {
    id: 'streak_3',
    name: 'Constant',
    description: '3 dies consecutius llegint!',
    icon: '🔥',
    condition: '3 dies de ratxa',
  },
  streak_7: {
    id: 'streak_7',
    name: 'Setmana de Foc',
    description: '7 dies consecutius llegint!',
    icon: '🔥🔥',
    condition: '7 dies de ratxa',
  },
  streak_30: {
    id: 'streak_30',
    name: 'Lector Imparable',
    description: '30 dies consecutius llegint!',
    icon: '🏆',
    condition: '30 dies de ratxa',
  },
  perfect_10: {
    id: 'perfect_10',
    name: 'Perfecte!',
    description: 'Has encertat 10 exercicis seguits!',
    icon: '💯',
    condition: '10 encerts seguits',
  },
  speed_reader: {
    id: 'speed_reader',
    name: 'Lector Ràpid',
    description: 'Has llegit 5 paraules en menys de 2 segons cadascuna!',
    icon: '⚡',
    condition: 'Llegeix 5 paraules ràpides',
  },
  syllable_master: {
    id: 'syllable_master',
    name: 'Mestre de Síl·labes',
    description: 'Has completat 20 exercicis de síl·labes!',
    icon: '🎯',
    condition: '20 exercicis de síl·labes',
  },
  word_master: {
    id: 'word_master',
    name: 'Mestre de Paraules',
    description: 'Has completat 20 exercicis de paraules!',
    icon: '📚',
    condition: '20 exercicis de paraules',
  },
  sentence_master: {
    id: 'sentence_master',
    name: 'Mestre de Frases',
    description: 'Has completat 10 exercicis de frases!',
    icon: '📖',
    condition: '10 exercicis de frases',
  },
  level_5: {
    id: 'level_5',
    name: 'Nivell 5',
    description: 'Has arribat al nivell 5!',
    icon: '🌟',
    condition: 'Arriba al nivell 5',
  },
  level_10: {
    id: 'level_10',
    name: 'Nivell 10',
    description: 'Has arribat al nivell 10!',
    icon: '👑',
    condition: 'Arriba al nivell 10',
  },
};

export const POKEMON_PATHS: PokemonPath[] = [
  {
    pathId: 'bulbasaur-syllables',
    pokemonId: 1,
    fallbackName: 'Bulbasaur',
    exerciseType: 'syllables',
    difficulty: 'easy',
    setIds: ['syl-easy-1', 'syl-easy-2', 'syl-easy-3'],
    basePower: 18,
    description: 'Aprèn les síl·labes bàsiques i posa en marxa el teu primer company de lectura.',
  },
  {
    pathId: 'ivysaur-syllables',
    pokemonId: 2,
    fallbackName: 'Ivysaur',
    exerciseType: 'syllables',
    difficulty: 'medium',
    setIds: ['syl-medium-1', 'syl-medium-2', 'syl-medium-3'],
    basePower: 36,
    description: 'Les síl·labes travades fan créixer la força del teu equip.',
  },
  {
    pathId: 'venusaur-syllables',
    pokemonId: 3,
    fallbackName: 'Venusaur',
    exerciseType: 'syllables',
    difficulty: 'hard',
    setIds: ['syl-hard-100'],
    basePower: 58,
    description: 'El gran repte de 100 síl·labes converteix aquesta branca en una potència estable.',
  },
  {
    pathId: 'charmander-words',
    pokemonId: 4,
    fallbackName: 'Charmander',
    exerciseType: 'words',
    difficulty: 'easy',
    setIds: ['words-easy-1', 'words-easy-2', 'words-easy-3', 'words-easy-4', 'words-easy-5'],
    basePower: 24,
    description: 'Les primeres paraules donen velocitat i confiança al teu atac.',
  },
  {
    pathId: 'charmeleon-words',
    pokemonId: 5,
    fallbackName: 'Charmeleon',
    exerciseType: 'words',
    difficulty: 'medium',
    setIds: ['words-medium-1', 'words-medium-2', 'words-medium-3'],
    basePower: 44,
    description: 'Paraules més llargues i específiques encenen una fase molt més ofensiva.',
  },
  {
    pathId: 'charizard-words',
    pokemonId: 6,
    fallbackName: 'Charizard',
    exerciseType: 'words',
    difficulty: 'hard',
    setIds: ['words-hard-1', 'words-hard-2', 'words-hard-3', 'w-hard-100'],
    basePower: 72,
    description: 'Dominar les paraules difícils activa una de les bèsties més fortes de la Pokédex.',
  },
  {
    pathId: 'dratini-sentences',
    pokemonId: 147,
    fallbackName: 'Dratini',
    exerciseType: 'sentences',
    difficulty: 'easy',
    setIds: ['sent-easy-1', 'sent-easy-2', 'sent-easy-3'],
    basePower: 34,
    description: 'Les frases senzilles obren la porta a una línia llegendària molt precisa.',
  },
  {
    pathId: 'dragonair-sentences',
    pokemonId: 148,
    fallbackName: 'Dragonair',
    exerciseType: 'sentences',
    difficulty: 'medium',
    setIds: ['sent-medium-1', 'sent-medium-2', 'sent-medium-3'],
    basePower: 62,
    description: 'Amb frases mitjanes, la teva lectura guanya elegància i resistència.',
  },
  {
    pathId: 'mew-sentences',
    pokemonId: 151,
    fallbackName: 'Mew',
    exerciseType: 'sentences',
    difficulty: 'hard',
    setIds: ['sent-hard-1', 'sent-hard-2', 'sent-hard-3', 'f-hard-100'],
    basePower: 96,
    description: 'Les frases difícils i llargues desbloquegen el Pokémon més tècnic i poderós.',
  },
];


/** Number of exercises a player must complete each day to meet the daily goal. */
export const DAILY_GOAL_TARGET = 5;
