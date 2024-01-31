import React from 'react';
// import MapComponents from "./components/MapComponents/MapComponents";
import Main from "./components/Main/Main";
import MapHolder from "./components/MapComponents/MapHolder";
import { ThemeProvider } from "@mui/material";
import { theme } from './Theme/CustomTheme';
import { Routes, Route } from "react-router-dom";
import FacultySelection from "./components/FacultySelection";

function App() {
  return (
      <ThemeProvider theme={ theme }>
        <div className="App">
            <Routes>
                <Route path="/" element={
                    <Main>
                        <MapHolder />
                    </Main> }
                />
                <Route path="/faculty" element={
                   <FacultySelection /> }
                />
            </Routes>
        </div>
      </ThemeProvider>
  );
}

export default App;
