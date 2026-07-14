import styles from './BadgesPage.module.css';
import { PokemonCollection } from '../components/gamification';
import { usePokemonCollection } from '../hooks';
import type { Profile } from '../models';

interface BadgesPageProps {
  profile: Profile;
}

export function BadgesPage({ profile }: BadgesPageProps) {
  const { collection, loading } = usePokemonCollection(profile.id);
  const unlockedPokemon = collection.filter((pokemon) => pokemon.unlocked).length;

  return (
    <div className={`page ${styles.page}`}>
      <h1 className="page-title">Col·lecció Pokémon</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Pokémon desbloquejats ({unlockedPokemon}/{collection.length || 0})
        </h2>
        <PokemonCollection collection={collection} loading={loading} />
      </section>
    </div>
  );
}
