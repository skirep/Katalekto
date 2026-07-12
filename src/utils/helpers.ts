export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function formatTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const s = Math.round(ms / 100) / 10;
  return `${s}s`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ca', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('ca', {
    month: 'short',
    day: 'numeric',
  });
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function percentageStr(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
}
