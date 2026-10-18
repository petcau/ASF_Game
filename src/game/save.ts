export const GAME_DAY_MS = 6 * 60 * 1000;
const SAVE_KEY = 'abelhas-nativas:save';
const SAVE_VERSION = 1;

export type GameLocation = 'site' | 'apiary';

export interface SaveState {
  version: number;
  elapsedMs: number;
  location: GameLocation;
  updatedAt: string;
}

const freshSave = (): SaveState => ({
  version: SAVE_VERSION,
  elapsedMs: 0,
  location: 'site',
  updatedAt: new Date().toISOString(),
});

export function loadSave(): SaveState {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '') as Partial<SaveState>;
    if (parsed.version !== SAVE_VERSION || typeof parsed.elapsedMs !== 'number') return freshSave();
    return {
      version: SAVE_VERSION,
      elapsedMs: Math.max(0, parsed.elapsedMs),
      location: parsed.location === 'apiary' ? 'apiary' : 'site',
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return freshSave();
  }
}

export function persistSave(state: SaveState): void {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function resetSave(): SaveState {
  const next = freshSave();
  persistSave(next);
  return next;
}

export function getCalendar(elapsedMs: number): { day: number; season: string; progress: number } {
  const elapsedDays = Math.floor(elapsedMs / GAME_DAY_MS);
  const day = (elapsedDays % 365) + 1;
  const seasonIndex = Math.min(3, Math.floor((day - 1) / 91.25));
  return {
    day,
    season: ['Primavera', 'Verão', 'Outono', 'Inverno'][seasonIndex],
    progress: (day - 1) / 364,
  };
}
