import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import { Typography, Breadcrumbs, Link, useTheme, CircularProgress, Paper } from "@mui/material";
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
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const {
		selectedFaculty,
		setSelectedBuildingId,
		setSelectedBuilding,
		selectedBuilding,
		setSelectedBuildingOriginal
	} = useFacultyContext();

	useEffect(() => {
		setIsLoading(true);
		const url = `${ serverAddress }/api/buildings/${selectedFaculty}`;

		// Fetch buildings data from the API
		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${ response.status }`);
				}

				return response.json();

			})
			.then(data => setBuildings(data))
			.catch(error => console.log("Fetching buildings failed: ", error))
			.finally(() => setIsLoading(false));
	}, []);

	const handleBuildingClick = (buildingId: number, buildingName: string) => {
		setSelectedBuilding(buildingName);
		setSelectedBuildingId(buildingId);
		navigate(`/${selectedFaculty}/${ buildingName.replace(/\s/g, "_") }`)
	}

	return (
		<Main topBarSelectedDisabled>
			<Paper sx={{height: "100%"}}>
				<Breadcrumbs separator="›" sx={ { bgcolor: palette.background.default, py: 1, } }>
					<Link><Typography variant="h5">{ selectedFaculty }</Typography></Link>
				</Breadcrumbs>
				<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
				     pb={ 4 } bgcolor="#323232" color="white" borderTop="2px solid gray">
					{ buildings.length > 0 && !isLoading? ( //first sort the buildings by name, then map them to a list
						buildings.sort((a: BuildingSelection, b: BuildingSelection) => a.name.localeCompare(b.name))
							.map((building: BuildingSelection, index) => (
								<Box key={ building.building_id }
								     width="100%"
								     pt="0.7em"
								     pb="0.7em"
								     bgcolor={ "background.paper" }
								     borderBottom="1px solid white"
								     onClick={ () => handleBuildingClick(building.building_id, building.name) }
								>
									<Typography variant="h5" ml="0.7em">{ building.name }</Typography>
								</Box>
							))
					) : (
						<Box width="100%" height="80%" display="flex" justifyContent="center" alignItems="center">
							<CircularProgress thickness={ 3 } size="5rem" />
						</Box>
					) }
				</Box>
			</Paper>

		</Main>
	);
}

export default BuildingSelection;
