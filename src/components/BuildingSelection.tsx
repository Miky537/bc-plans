import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import { Typography } from "@mui/material";
import { useFacultyContext } from "./FacultyContext";
import { useNavigate } from "react-router-dom";

export interface BuildingSelection {
	name: string;
	address: string;
	building_id: number;
}

function BuildingSelection() {
	const [buildings, setBuildings] = useState([]);
	const navigate = useNavigate();
	const { selectedBuildingId, setSelectedBuildingId } = useFacultyContext();

	useEffect(() => {
		const url = `${ serverAddress }/api/buildings/FIT`;

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
		console.log("budovaid", buildingId);
		setSelectedBuildingId(buildingId);
		navigate(`/FIT/${ buildingName.replace(/\s/g, "-")}`)
	}

	return (
		<Main>
			<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white">
				{ buildings.length > 0? ( //first sort the buildings by name, then map them to a list
					buildings.sort((a: BuildingSelection, b: BuildingSelection) => a.name.localeCompare(b.name))
						.map((building: BuildingSelection, index) => (
							<Box key={ building.name }
							     width="100%"
							     pt="0.7em"
							     pb="0.7em"
							     pl="0.7em"
							     bgcolor={ index % 2? "black" : "grey" }
							     onClick={ () => handleBuildingClick(building.building_id, building.name) }
							>
								<Typography variant="h5">{ building.name }</Typography>
							</Box>
						))
				) : (
					<Typography>No buildings found for the selected faculty.</Typography>
				) }
			</Box>
		</Main>
	);
}

export default BuildingSelection;
