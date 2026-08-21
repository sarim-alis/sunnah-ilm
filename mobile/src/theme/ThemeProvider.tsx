import { createContext, useContext, type ReactNode } from 'react';
import { normalizeMode, palettes, type AppMode, type ThemeColors } from '@/constants/colors';
import { useCurrentUser } from '@/users/hooks';

type ThemeValue = {
  mode: AppMode;
  colors: ThemeColors;
};

const ThemeContext = createContext<ThemeValue>({
  mode: 'light',
  colors: palettes.light,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { data: user } = useCurrentUser();
  const mode = normalizeMode(user?.mode);
  const value: ThemeValue = {
    mode,
    colors: palettes[mode],
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
