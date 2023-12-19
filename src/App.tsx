import React from 'react';
// import MapComponents from "./components/MapComponents/MapComponents";
import Main from "./components/Main/Main";
import MapHolder from "./components/MapComponents/MapHolder";
import { ThemeProvider } from "@mui/material";
import { theme } from './Theme/CustomTheme';

function App() {
  return (
      <ThemeProvider theme={ theme }>
        <div className="App">
            <Main>
                <MapHolder />
            </Main>
        </div>
      </ThemeProvider>
  );
}

export default App;
