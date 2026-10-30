export const accents = [
  'indigo',
  'violet',
  'mint',
  'sky',
  'cyan',
  'orange',
  'blue',
  'blurple',
  'green',
  'rose',
] as const;
export type Accent = (typeof accents)[number];
export type Mode = 'light' | 'dark' | 'system';
export type Appearance = { readonly mode: Mode; readonly accent: Accent };
export const appearanceKey = 'gjp-lab.appearance';

// Self-contained: Vite embeds this same parser in the blocking startup script.
export function parseAppearance(raw: string | null, allowed: readonly Accent[]): Appearance {
  let value: unknown;
  try {
    value = JSON.parse(raw ?? 'null');
  } catch {
    value = null;
  }
  const data = typeof value === 'object' && value !== null ? value : {};
  const mode = 'mode' in data ? data.mode : undefined;
  const accent = 'accent' in data ? data.accent : undefined;
  return {
    mode: mode === 'light' || mode === 'dark' ? mode : 'system',
    accent: allowed.find((item) => item === accent) ?? 'mint',
  };
}

export function resolveMode(mode: Mode, systemDark: boolean): 'light' | 'dark' {
  return mode === 'system' ? (systemDark ? 'dark' : 'light') : mode;
}

export function readAppearance(storage: { getItem(key: string): string | null }): Appearance {
  try {
    return parseAppearance(storage.getItem(appearanceKey), accents);
  } catch {
    return parseAppearance(null, accents);
  }
}
