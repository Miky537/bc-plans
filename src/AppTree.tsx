import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MapProvider } from "./Contexts/MapContext";
import MapHolder from "./components/MapComponents/MapHolder";
import TeacherSearch from "./components/TeacherSearch/TeacherSearch";
import BuildingSelection from "./components/Selections/BuildingSelection/BuildingSelection";
import FloorSelection from "./components/Selections/FloorSelection/FloorSelection";
import FavouritePlaces from "./components/FavouritePlaces";
import { SpeedInsights } from '@vercel/speed-insights/react';
import React, { useEffect } from "react";
import Main from "./components/Main/Main";
import useAuthToken from "./hooks/useAuthToken";
import { FacultyProvider } from "./Contexts/FacultyContext";

export default function AppTree() {

	const { loginMutate } = useAuthToken();

	useEffect(() => {
		loginMutate(); // Fetch the token
	}, [loginMutate]);


	return (
		<div className="App">
			<BrowserRouter>
				<MapProvider>
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
							<Route path="/map/:faculty/:building/:floor/:roomName"
							       element={ <Main><MapHolder /></Main> } />
							<Route path="/map/:faculty" element={ <Main><MapHolder /></Main> } />
							<Route path="/fvPlaces" element={ <Main><FavouritePlaces /></Main> } />
							<Route path="*" element={ <Main><TeacherSearch /></Main> } />
						</Routes>
						<SpeedInsights />
					</FacultyProvider>
				</MapProvider>
			</BrowserRouter>
		</div>
	);
}
