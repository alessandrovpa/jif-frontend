import React, { createContext, useCallback } from 'react';
import { ThemeProvider as Theme, DefaultTheme } from 'styled-components';
import usePersistedState from '../utils/usePersistedState';

import light from '../styles/themes/light';
import dark from '../styles/themes/dark';

interface ThemeContextData {
  toggleTheme(): void;
}

export const ThemeContext = createContext<ThemeContextData>(
  {} as ThemeContextData,
);

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = usePersistedState<DefaultTheme>(
    '@King:theme',
    light,
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme.title === 'light' ? dark : light);
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ toggleTheme }}>
      <Theme theme={theme}>{children}</Theme>
    </ThemeContext.Provider>
  );
};
