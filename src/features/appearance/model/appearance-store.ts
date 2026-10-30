import { createStore } from 'zustand/vanilla';
import type { Appearance } from './appearance';

export function createAppearanceStore(initial: Appearance) {
  return createStore<{
    readonly appearance: Appearance;
    readonly setAppearance: (next: Appearance) => void;
  }>()((set) => ({
    appearance: initial,
    setAppearance: (appearance) => set({ appearance }),
  }));
}
