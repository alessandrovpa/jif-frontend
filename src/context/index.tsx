import React from 'react';
import { ToastProvider } from './ToastContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

const AppProvider: React.FC = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  </ThemeProvider>
);

export default AppProvider;
