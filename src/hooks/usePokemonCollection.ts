import { useEffect, useState } from 'react';
import { POKEMON_PATHS, type PokemonCollectionItem } from '../models';
import { getSetById } from '../exercises';
import { pokeApiService } from '../services/pokeApiService';
import { sessionStorage } from '../storage';

export function usePokemonCollection(profileId: string | null) {
  const [collection, setCollection] = useState<PokemonCollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    const load = async () => {
      const sessions = profileId ? await sessionStorage.getAllByProfile(profileId) : [];
      const successfulSessions = sessions.filter((session) => session.score >= 60);

      const nextCollection = await Promise.all(
        POKEMON_PATHS.map(async (path) => {
          const pokemon = await pokeApiService.getPokemon(path.pokemonId, path.fallbackName);
          const relevantSessions = successfulSessions.filter((session) => path.setIds.includes(session.setId));
          const completedSetIds = Array.from(new Set(relevantSessions.map((session) => session.setId)));
          const assignedExerciseTitles = path.setIds.map((setId) => getSetById(setId)?.title ?? setId);
          const unlocked = completedSetIds.length > 0;
          const bestScore = relevantSessions.length > 0
            ? Math.max(...relevantSessions.map((session) => session.score))
            : 0;
          const averageScore = relevantSessions.length > 0
            ? relevantSessions.reduce((sum, session) => sum + session.score, 0) / relevantSessions.length
            : 0;
          const progressPercent = path.setIds.length > 0 ? completedSetIds.length / path.setIds.length : 0;
          const power = path.basePower
            + (completedSetIds.length * 9)
            + Math.round(averageScore / 6)
            + Math.min(relevantSessions.length * 2, 18);
          const firstAssignedTitle = assignedExerciseTitles[0] ?? 'el primer exercici del camí';
          const unlockCondition = unlocked
            ? `${completedSetIds.length}/${path.setIds.length} exercicis superats · millor puntuació ${bestScore}%`
            : `Completa ${firstAssignedTitle}`;

          return {
            ...path,
            ...pokemon,
            unlocked,
            unlockCondition,
            assignedExerciseTitles,
            completedSetIds,
            completedSessions: relevantSessions.length,
            progressPercent,
            bestScore,
            power,
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
