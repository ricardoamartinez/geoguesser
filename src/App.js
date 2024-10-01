import React from 'react';
import GlobeComponent from './components/GlobeComponent';
import MainMenu from './components/MainMenu';
import StarryBackground from './components/StarryBackground';
import GlobalStyles from './GlobalStyles';
import { ThemeProvider } from 'styled-components';

const darkTheme = {
  body: '#121212',
  text: '#ffffff',
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles />
      <StarryBackground />
      <GlobeComponent />
      <MainMenu />
    </ThemeProvider>
  );
}

export default App;
