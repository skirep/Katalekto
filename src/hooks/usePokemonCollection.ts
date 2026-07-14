import { useEffect, useState } from 'react';
import { POKEMON_REWARDS, type PokemonCollectionItem } from '../models';
import { pokeApiService } from '../services/pokeApiService';
import { gamificationStorage, profileStorage } from '../storage';

export function usePokemonCollection(profileId: string | null) {
  const [collection, setCollection] = useState<PokemonCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    const load = async () => {
      const [stats, streak, badges] = profileId
        ? await Promise.all([
          profileStorage.getStats(profileId),
          gamificationStorage.getStreak(profileId),
          gamificationStorage.getBadges(profileId),
        ])
        : [null, { current: 0 }, []];
      const totalProgress = Math.max(
        stats?.totalCorrect ?? 0,
        stats?.totalExercises ?? 0,
      );
      const milestonePoints = (stats?.level ?? 1) + streak.current + (badges.length * 2);

      const nextCollection = await Promise.all(
        POKEMON_REWARDS.map(async (reward) => {
          const pokemon = await pokeApiService.getPokemon(reward.pokemonId, reward.fallbackName);
          const unlocked = reward.unlockRequirement.type === 'progress'
            ? totalProgress >= reward.unlockRequirement.target
            : milestonePoints >= reward.unlockRequirement.target;
          const unlockCondition = reward.unlockRequirement.type === 'progress'
            ? `${reward.unlockRequirement.target} avenç${reward.unlockRequirement.target === 1 ? '' : 'os'}`
            : `${reward.unlockRequirement.target} punts de fites`;

          return {
            ...reward,
            ...pokemon,
            unlocked,
            unlockCondition,
          } satisfies PokemonCollectionItem;
        }),
      );

      if (!cancelled) {
        setCollection(nextCollection);
        setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  return { collection, loading };
}
