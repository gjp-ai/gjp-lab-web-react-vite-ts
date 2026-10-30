import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { useStore } from 'zustand';
import {
  type Appearance,
  accents,
  appearanceKey,
  parseAppearance,
  readAppearance,
  resolveMode,
} from '@/features/appearance/model/appearance';
import { createAppearanceStore } from '../model/appearance-store';

type ContextValue = {
  readonly appearance: Appearance;
  readonly update: (next: Appearance) => void;
};
const AppearanceContext = createContext<ContextValue | null>(null);

function initialAppearance() {
  try {
    return readAppearance(window.localStorage);
  } catch {
    return parseAppearance(null, accents);
  }
}
function systemIsDark() {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function AppearanceProvider({ children }: { readonly children: ReactNode }) {
  const [store] = useState(() => createAppearanceStore(initialAppearance()));
  const appearance = useStore(store, (state) => state.appearance);
  const setAppearance = store.getState().setAppearance;
  const [systemDark, setSystemDark] = useState(systemIsDark);
  const resolved = resolveMode(appearance.mode, systemDark);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.mode = resolved;
    root.dataset.accent = appearance.accent;
    root.style.colorScheme = resolved;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', getComputedStyle(root).getPropertyValue('--background').trim());
  }, [resolved, appearance.accent]);

  useEffect(() => {
    let query: MediaQueryList | undefined;
    const onSystemChange = () => setSystemDark(query?.matches ?? false);
    try {
      query = window.matchMedia('(prefers-color-scheme: dark)');
      query.addEventListener('change', onSystemChange);
      onSystemChange();
    } catch {
      /* Unsupported media queries fall back to light. */
    }
    function onStorage(event: StorageEvent) {
      try {
        if (event.storageArea !== window.localStorage) return;
        if (event.key === appearanceKey || event.key === null)
          setAppearance(parseAppearance(event.newValue, accents));
      } catch {
        /* Storage is optional; keep this session's selection. */
      }
    }
    window.addEventListener('storage', onStorage);
    return () => {
      query?.removeEventListener('change', onSystemChange);
      window.removeEventListener('storage', onStorage);
    };
  }, [setAppearance]);

  function update(next: Appearance) {
    setAppearance(next);
    try {
      window.localStorage.setItem(appearanceKey, JSON.stringify(next));
    } catch {
      /* Apply locally even when persistence is unavailable. */
    }
  }
  return (
    <AppearanceContext.Provider value={{ appearance, update }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const value = useContext(AppearanceContext);
  if (!value) throw new Error('Appearance controls require AppearanceProvider');
  return value;
}
