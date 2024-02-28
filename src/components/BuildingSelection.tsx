import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import { Typography, Breadcrumbs, Link, useTheme } from "@mui/material";
import { useFacultyContext } from "./FacultyContext";
import { useNavigate } from "react-router-dom";

export interface BuildingSelection {
	name: string;
	address: string;
	building_id: number;
}

function BuildingSelection() {
	const { palette } = useTheme();
	const [buildings, setBuildings] = useState([]);
	const navigate = useNavigate();
	const { selectedFaculty, setSelectedBuildingId, setSelectedBuilding } = useFacultyContext();

	useEffect(() => {
		const url = `${ serverAddress }/api/buildings/FAST`;

		// Fetch buildings data from the API
		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${ response.status }`);
				}

				return response.json();

			})
			.then(data => setBuildings(data))
			.catch(error => console.log("Fetching buildings failed: ", error));
	}, []);

	const handleBuildingClick = (buildingId: number, buildingName: string) => {
		setSelectedBuilding(buildingName);
		setSelectedBuildingId(buildingId);
		navigate(`/FAST/${ buildingName.replace(/\s/g, "_")}`)
	}

	const handleFavPlacesClick = () => {
		navigate(`/fvPlaces`);
	}

	return (
		<Main>
			<Breadcrumbs separator="›" sx={ { bgcolor: palette.background.default, py: 1, } }>
				<Link><Typography variant="h5">{ selectedFaculty }</Typography></Link>
			</Breadcrumbs>
			<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white">
				{ buildings.length > 0? ( //first sort the buildings by name, then map them to a list
					buildings.sort((a: BuildingSelection, b: BuildingSelection) => a.name.localeCompare(b.name))
						.map((building: BuildingSelection, index) => (
							<Box key={ building.name }
							     width="100%"
							     pt="0.7em"
							     pb="0.7em"
							     bgcolor={ index % 2? "black" : "grey" }
							     onClick={ () => handleBuildingClick(building.building_id, building.name) }
							>
								<Typography variant="h5" ml="0.7em">{ building.name }</Typography>
							</Box>
						))
				) : (
					<Typography>No buildings found for the selected faculty.</Typography>
				) }
				<Box position="absolute"
				     bottom="0"
				     py="1em"
				     display="flex"
				     justifyContent="center"
				     width="100%"
				     bgcolor="gray"
					 onClick={() => handleFavPlacesClick()}>
					<Typography variant="h5">Favourite places</Typography>
				</Box>
			</Box>
		</Main>
	);
}

export default BuildingSelection;
