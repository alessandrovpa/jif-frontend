import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';

import GlobalStyle from './styles/global';

import AppProvider from './context';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="https://jifnacional.ifgoiano.edu.br">
      <AppProvider>
        <Routes />

        <GlobalStyle />
      </AppProvider>
    </BrowserRouter>
  );
};

export default App;
