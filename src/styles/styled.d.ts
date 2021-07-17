import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;
    colors: {
      background: string;
      primary: string;
      light: string;
      dark: string;
      textLight: string;
      textDark: string;
    };
    error: string;
    success: string;
  }
}
