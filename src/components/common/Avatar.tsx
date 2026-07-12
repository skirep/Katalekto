import styles from './Avatar.module.css';

const EMOJI_MAP: Record<string, string> = {
  cat: '🐱',
  dog: '🐶',
  rabbit: '🐰',
  bear: '🐻',
  fox: '🦊',
  owl: '🦉',
  penguin: '🐧',
  unicorn: '🦄',
  dragon: '🐲',
  elephant: '🐘',
};

interface AvatarProps {
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
}

export function Avatar({ avatarId, size = 'md', name }: AvatarProps) {
  const emoji = EMOJI_MAP[avatarId] ?? '😊';
  return (
    <div className={`${styles.avatar} ${styles[size]}`} title={name}>
      {emoji}
    </div>
  );
}
