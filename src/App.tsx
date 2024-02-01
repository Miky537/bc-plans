import React from 'react';
// import MapComponents from "./components/MapComponents/MapComponents";
import Main from "./components/Main/Main";
import MapHolder from "./components/MapComponents/MapHolder";
import { ThemeProvider } from "@mui/material";
import { theme } from './Theme/CustomTheme';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import FacultySelection from "./components/FacultySelection/FacultySelection";

function App() {
  return (
      <ThemeProvider theme={ theme }>
        <div className="App">
            <BrowserRouter>
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
            </BrowserRouter>
        </div>
      </ThemeProvider>
  );
}

export default App;
