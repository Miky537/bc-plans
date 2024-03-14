import React from 'react';
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
import TeacherSearch from "./components/TeacherSearch/TeacherSearch";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();
function App() {


    return (
      <ThemeProvider theme={ theme }>
          <QueryClientProvider client={ queryClient }>
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
                          <Route path="/map/FIT" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FAST" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FSI" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FEKT" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FAVU" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FCH" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/USI" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FP" element={
                              <Main>
                                  <MapHolder />
                              </Main> }
                          />
                          <Route path="/map/FA" element={
                              <Main>
                                  <MapHolder />
                              </Main>
                          }
                          />
                          <Route path="/map" element={
                              <Main>
                                  <MapHolder />
                              </Main>
                          }
                          />
                          <Route path="/faculty" element={
                              <TeacherSearch />
                              // <FacultySelection />
                          }
                          />
                          <Route path="/teacher" element={ <TeacherSearch /> } />
                          <Route path="/select" element={
                              <BuildingSelection /> }
                          />
                          <Route path="/:faculty" element={ <BuildingSelection /> } />
                          <Route path="/:faculty/:building" element={ <FloorSelection /> } />
                          <Route path="/:faculty/:building/:floor" element={ <FloorSelection /> } />
                          <Route path="/:faculty/:building/:floor/:roomName" element={ <Main><MapHolder /></Main> } />
                          <Route path="/fvPlaces" element={ <Main><FavouritePlaces /></Main> } />
                          <Route path="*" element={ <FacultySelection /> } />
                      </Routes>
                      </FacultyProvider>
                  </BrowserRouter>
              </div>
          </MapProvider>
          </QueryClientProvider>
      </ThemeProvider>
  );
}

export default App;
