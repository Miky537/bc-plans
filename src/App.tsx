import React from 'react';
// import MapComponents from "./components/MapComponents/MapComponents";
import Main from "./components/Main/Main";
import MapHolder from "./components/MapComponents/MapHolder";
import { ThemeProvider } from "@mui/material";
import { theme } from './Theme/CustomTheme';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { MapProvider } from "./components/MapComponents/MapContext";
import FacultySelection from "./components/FacultySelection/FacultySelection";
import BuildingSelection from "./components/BuildingSelection";
import FloorSelection from "./components/FloorSelection";
import { FacultyProvider } from "./components/FacultyContext";
import FavouritePlaces from "./components/FavouritePlaces";

function App() {

    return (
      <ThemeProvider theme={ theme }>
          <MapProvider>
              <div className="App">
                  <BrowserRouter>
                      <FacultyProvider>
                      <Routes>
                          <Route path="/" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FIT" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FAST" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FSI" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FEKT" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FAVU" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FCH" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/USI" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FP" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/FA" element={
                              <Main>
                                  <MapHolder />
                              </Main>
                          }
                          />
                          <Route path="/faculty" element={
                              <FacultySelection /> }
                          />
                          <Route path="/Random" element={
                              <BuildingSelection /> }
                          />
                          <Route path="/:faculty" element={ <BuildingSelection /> } />
                          <Route path="/:faculty/:building" element={ <FloorSelection /> } />
                          <Route path="/:faculty/:building/:floor" element={ <FloorSelection /> } />
                          <Route path="/:faculty/:building/:floor/:roomName" element={ <Main><MapHolder /></Main> } />
                          <Route path="/fvPlaces" element={ <Main><FavouritePlaces /></Main> } />
                          <Route path="*" element={
                              <FacultySelection /> }
                          />
                      </Routes>
                      </FacultyProvider>
                  </BrowserRouter>
              </div>
          </MapProvider>
      </ThemeProvider>
  );
}

export default App;
