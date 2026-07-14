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

export interface PokemonReward {
  pokemonId: number;
  fallbackName: string;
  requiredExercises: number;
}

export interface PokemonDetails {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface PokemonCollectionItem extends PokemonReward, PokemonDetails {
  unlocked: boolean;
  unlockCondition: string;
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

export const POKEMON_REWARDS: PokemonReward[] = [
  { pokemonId: 1, fallbackName: 'Bulbasaur', requiredExercises: 1 },
  { pokemonId: 4, fallbackName: 'Charmander', requiredExercises: 2 },
  { pokemonId: 7, fallbackName: 'Squirtle', requiredExercises: 3 },
  { pokemonId: 25, fallbackName: 'Pikachu', requiredExercises: 4 },
  { pokemonId: 52, fallbackName: 'Meowth', requiredExercises: 5 },
  { pokemonId: 39, fallbackName: 'Jigglypuff', requiredExercises: 6 },
  { pokemonId: 133, fallbackName: 'Eevee', requiredExercises: 7 },
  { pokemonId: 54, fallbackName: 'Psyduck', requiredExercises: 8 },
  { pokemonId: 79, fallbackName: 'Slowpoke', requiredExercises: 9 },
  { pokemonId: 35, fallbackName: 'Clefairy', requiredExercises: 10 },
  { pokemonId: 2, fallbackName: 'Ivysaur', requiredExercises: 12 },
  { pokemonId: 5, fallbackName: 'Charmeleon', requiredExercises: 13 },
  { pokemonId: 8, fallbackName: 'Wartortle', requiredExercises: 14 },
  { pokemonId: 26, fallbackName: 'Raichu', requiredExercises: 15 },
  { pokemonId: 92, fallbackName: 'Gastly', requiredExercises: 16 },
  { pokemonId: 63, fallbackName: 'Abra', requiredExercises: 17 },
  { pokemonId: 58, fallbackName: 'Growlithe', requiredExercises: 18 },
  { pokemonId: 77, fallbackName: 'Ponyta', requiredExercises: 19 },
  { pokemonId: 60, fallbackName: 'Poliwag', requiredExercises: 20 },
  { pokemonId: 43, fallbackName: 'Oddish', requiredExercises: 22 },
  { pokemonId: 3, fallbackName: 'Venusaur', requiredExercises: 24 },
  { pokemonId: 6, fallbackName: 'Charizard', requiredExercises: 25 },
  { pokemonId: 9, fallbackName: 'Blastoise', requiredExercises: 26 },
  { pokemonId: 93, fallbackName: 'Haunter', requiredExercises: 27 },
  { pokemonId: 64, fallbackName: 'Kadabra', requiredExercises: 28 },
  { pokemonId: 66, fallbackName: 'Machop', requiredExercises: 29 },
  { pokemonId: 74, fallbackName: 'Geodude', requiredExercises: 30 },
  { pokemonId: 41, fallbackName: 'Zubat', requiredExercises: 32 },
  { pokemonId: 46, fallbackName: 'Paras', requiredExercises: 34 },
  { pokemonId: 16, fallbackName: 'Pidgey', requiredExercises: 35 },
  { pokemonId: 19, fallbackName: 'Rattata', requiredExercises: 36 },
  { pokemonId: 21, fallbackName: 'Spearow', requiredExercises: 37 },
  { pokemonId: 23, fallbackName: 'Ekans', requiredExercises: 38 },
  { pokemonId: 27, fallbackName: 'Sandshrew', requiredExercises: 39 },
  { pokemonId: 37, fallbackName: 'Vulpix', requiredExercises: 40 },
  { pokemonId: 56, fallbackName: 'Mankey', requiredExercises: 42 },
  { pokemonId: 72, fallbackName: 'Tentacool', requiredExercises: 44 },
  { pokemonId: 81, fallbackName: 'Magnemite', requiredExercises: 45 },
  { pokemonId: 86, fallbackName: 'Seel', requiredExercises: 46 },
  { pokemonId: 88, fallbackName: 'Grimer', requiredExercises: 47 },
  { pokemonId: 90, fallbackName: 'Shellder', requiredExercises: 48 },
  { pokemonId: 96, fallbackName: 'Drowzee', requiredExercises: 49 },
  { pokemonId: 98, fallbackName: 'Krabby', requiredExercises: 50 },
  { pokemonId: 94, fallbackName: 'Gengar', requiredExercises: 52 },
  { pokemonId: 65, fallbackName: 'Alakazam', requiredExercises: 54 },
  { pokemonId: 67, fallbackName: 'Machoke', requiredExercises: 55 },
  { pokemonId: 59, fallbackName: 'Arcanine', requiredExercises: 56 },
  { pokemonId: 80, fallbackName: 'Slowbro', requiredExercises: 57 },
  { pokemonId: 61, fallbackName: 'Poliwhirl', requiredExercises: 58 },
  { pokemonId: 44, fallbackName: 'Gloom', requiredExercises: 59 },
  { pokemonId: 75, fallbackName: 'Graveler', requiredExercises: 60 },
  { pokemonId: 42, fallbackName: 'Golbat', requiredExercises: 62 },
  { pokemonId: 47, fallbackName: 'Parasect', requiredExercises: 64 },
  { pokemonId: 17, fallbackName: 'Pidgeotto', requiredExercises: 65 },
  { pokemonId: 22, fallbackName: 'Fearow', requiredExercises: 66 },
  { pokemonId: 24, fallbackName: 'Arbok', requiredExercises: 67 },
  { pokemonId: 28, fallbackName: 'Sandslash', requiredExercises: 68 },
  { pokemonId: 38, fallbackName: 'Ninetales', requiredExercises: 69 },
  { pokemonId: 57, fallbackName: 'Primeape', requiredExercises: 70 },
  { pokemonId: 73, fallbackName: 'Tentacruel', requiredExercises: 72 },
  { pokemonId: 82, fallbackName: 'Magneton', requiredExercises: 74 },
  { pokemonId: 87, fallbackName: 'Dewgong', requiredExercises: 75 },
  { pokemonId: 89, fallbackName: 'Muk', requiredExercises: 76 },
  { pokemonId: 91, fallbackName: 'Cloyster', requiredExercises: 77 },
  { pokemonId: 97, fallbackName: 'Hypno', requiredExercises: 78 },
  { pokemonId: 99, fallbackName: 'Kingler', requiredExercises: 79 },
  { pokemonId: 95, fallbackName: 'Onix', requiredExercises: 80 },
  { pokemonId: 68, fallbackName: 'Machamp', requiredExercises: 82 },
  { pokemonId: 62, fallbackName: 'Poliwrath', requiredExercises: 84 },
  { pokemonId: 45, fallbackName: 'Vileplume', requiredExercises: 85 },
  { pokemonId: 76, fallbackName: 'Golem', requiredExercises: 86 },
  { pokemonId: 18, fallbackName: 'Pidgeot', requiredExercises: 87 },
  { pokemonId: 100, fallbackName: 'Voltorb', requiredExercises: 88 },
  { pokemonId: 101, fallbackName: 'Electrode', requiredExercises: 89 },
  { pokemonId: 102, fallbackName: 'Exeggcute', requiredExercises: 90 },
  { pokemonId: 103, fallbackName: 'Exeggutor', requiredExercises: 91 },
  { pokemonId: 104, fallbackName: 'Cubone', requiredExercises: 92 },
  { pokemonId: 105, fallbackName: 'Marowak', requiredExercises: 93 },
  { pokemonId: 106, fallbackName: 'Hitmonlee', requiredExercises: 94 },
  { pokemonId: 107, fallbackName: 'Hitmonchan', requiredExercises: 95 },
  { pokemonId: 108, fallbackName: 'Lickitung', requiredExercises: 96 },
  { pokemonId: 109, fallbackName: 'Koffing', requiredExercises: 97 },
  { pokemonId: 110, fallbackName: 'Weezing', requiredExercises: 98 },
  { pokemonId: 111, fallbackName: 'Rhyhorn', requiredExercises: 99 },
  { pokemonId: 112, fallbackName: 'Rhydon', requiredExercises: 100 },
  { pokemonId: 113, fallbackName: 'Chansey', requiredExercises: 102 },
  { pokemonId: 114, fallbackName: 'Tangela', requiredExercises: 104 },
  { pokemonId: 115, fallbackName: 'Kangaskhan', requiredExercises: 106 },
  { pokemonId: 116, fallbackName: 'Horsea', requiredExercises: 108 },
  { pokemonId: 117, fallbackName: 'Seadra', requiredExercises: 110 },
  { pokemonId: 118, fallbackName: 'Goldeen', requiredExercises: 112 },
  { pokemonId: 119, fallbackName: 'Seaking', requiredExercises: 114 },
  { pokemonId: 120, fallbackName: 'Staryu', requiredExercises: 116 },
  { pokemonId: 121, fallbackName: 'Starmie', requiredExercises: 118 },
  { pokemonId: 122, fallbackName: 'Mr. Mime', requiredExercises: 120 },
  { pokemonId: 123, fallbackName: 'Scyther', requiredExercises: 123 },
  { pokemonId: 124, fallbackName: 'Jynx', requiredExercises: 126 },
  { pokemonId: 125, fallbackName: 'Electabuzz', requiredExercises: 129 },
  { pokemonId: 126, fallbackName: 'Magmar', requiredExercises: 132 },
  { pokemonId: 127, fallbackName: 'Pinsir', requiredExercises: 135 },
  { pokemonId: 128, fallbackName: 'Tauros', requiredExercises: 138 },
  { pokemonId: 130, fallbackName: 'Gyarados', requiredExercises: 142 },
  { pokemonId: 131, fallbackName: 'Lapras', requiredExercises: 146 },
  { pokemonId: 143, fallbackName: 'Snorlax', requiredExercises: 150 },
  { pokemonId: 149, fallbackName: 'Dragonite', requiredExercises: 175 },
];

export const DAILY_GOAL_TARGET = 5;
