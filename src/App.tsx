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
                          <Route path="/map" element={
                              <Main>
                                  <MapHolder />
                              </Main>
                          }
                          />
                          <Route path="/faculty" element={
                              <TeacherSearch />
                          }
                          />
                          <Route path="/teacher" element={ <TeacherSearch /> } />
                          <Route path="/select" element={
                              <BuildingSelection /> }
                          />
                          <Route path="/:faculty" element={ <BuildingSelection /> } />
                          <Route path="/:faculty/:building" element={ <FloorSelection /> } />
                          <Route path="/:faculty/:building/:floor" element={ <FloorSelection /> } />
                          <Route path="/map/:faculty/:building/:floor/:roomName" element={ <Main><MapHolder /></Main> } />
                          <Route path="/map/:faculty" element={ <Main><MapHolder /></Main> } />
                          <Route path="/fvPlaces" element={ <Main><FavouritePlaces /></Main> } />
                          <Route path="*" element={ <Main><FacultySelection /></Main> } />
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
