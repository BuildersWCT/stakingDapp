import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Preference = Theme | 'system';

type ThemeContextValue = {
  theme: Theme; // effective applied theme
  preference: Preference; // user preference
  setPreference: (p: Preference) => void;
  toggleTheme: () => void; // quick toggle sets explicit light/dark
};

const STORAGE_KEY = 'crystal-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<Preference>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'system') return stored as Preference;
    } catch (e) {
      // ignore
    }
    return 'system';
  });

  // derived effective theme
  const [theme, setTheme] = useState<Theme>(() => {
    if (preference !== 'system') return preference;
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  });

  // apply effective theme whenever preference or system changes
  useEffect(() => {
    const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const systemPrefersDark = mq ? mq.matches : false;
    const effective: Theme = preference === 'system' ? (systemPrefersDark ? 'dark' : 'light') : preference;

    setTheme(effective);
    const root = document.documentElement;
    root.dataset.theme = effective;

    // smooth transition helper
    root.classList.add('theme-transition');
    const t = window.setTimeout(() => root.classList.remove('theme-transition'), 300);

    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch (e) {
      // ignore
    }

    return () => window.clearTimeout(t);
  }, [preference]);

  // listen to system preference changes and update effective theme only when preference is 'system'
  useEffect(() => {
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)');
    } catch (e) {
      mq = null;
    }
    if (!mq) return;

    const handler = (ev: MediaQueryListEvent) => {
      if (preference === 'system') {
        const effective: Theme = ev.matches ? 'dark' : 'light';
        setTheme(effective);
        document.documentElement.dataset.theme = effective;
      }
    };

    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else if (mq.addListener) {
      mq.addListener(handler);
    }
    return () => {
      if (mq) {
        if (mq.removeEventListener) {
          mq.removeEventListener('change', handler);
        } else if (mq.removeListener) {
          mq.removeListener(handler);
        }
      }
    };
  }, [preference]);

  const setPreference = (p: Preference) => setPreferenceState(p);
  const toggleTheme = () => {
    // toggles between explicit light/dark (if currently system, toggle based on current effective theme)
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setPreferenceState(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider;
