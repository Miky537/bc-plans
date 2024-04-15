import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "../../Main/Main";
import { Typography, Breadcrumbs, Link, useTheme, CircularProgress, Paper, Button } from "@mui/material";
import { useFacultyContext } from "../../../Contexts/FacultyContext";
import { useNavigate } from "react-router-dom";
import BuildingSelItem from "./BuldingSelItem";
import MapButton from "../../MapButton";

export interface BuildingSelectionInt {
	name: string;
	address: string;
	building_id: number;
}

function BuildingSelection() {
	const { palette } = useTheme();
	const [buildings, setBuildings] = useState([]);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const {
		selectedFaculty,
		setSelectedBuildingId,
		setSelectedBuilding,
		setSelectedFloor,
	} = useFacultyContext();

	useEffect(() => {
		setIsLoading(true);
		const url = `${ process.env.REACT_APP_BACKEND_URL }/api/buildings/${ selectedFaculty }`;

		// Fetch buildings data from the API
		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${ response.status }`);
				}
				return response.json();
			})
			.then(data => {
				setBuildings(data)
			})
			.catch(error => console.log("Fetching buildings failed: ", error))
			.finally(() => setIsLoading(false));
	}, []);

	const handleBuildingClick = (buildingId: number, buildingName: string) => {
		setSelectedBuilding(buildingName);
		setSelectedBuildingId(buildingId);
		setSelectedFloor(undefined)
		navigate(`/${ selectedFaculty }/${ buildingName.replace(/\s/g, "_") }`)
	}

	return (
		<Main topBarSelectedDisabled>
			<Paper sx={ {
				height: "100%",
				minHeight: "fit-content",
				width: "100%",
				maxWidth: "1440px",
				margin: "auto",
				mb: "calc(5em - 12px)",
				position: 'relative', // Ensures the Paper can correctly handle sticky children
				overflow: 'auto' // Ensures Paper can scroll if content overflows
			} }>
				<Box sx={ { position: 'sticky', top: 0, zIndex: 1, borderBottom: "2px solid white" } }>
					<Breadcrumbs separator="›" sx={ { bgcolor: 'background.default', py: 1, pl: 2 } }>
						<Link underline="hover">
							<Typography variant="h5">
								{ selectedFaculty }
							</Typography>
						</Link>
					</Breadcrumbs>
				</Box>
				<Box display="flex" flexDirection="column" justifyContent="flex-start" width="100%" margin="auto"
				     color={ palette.text.primary } borderTop="2px solid gray" overflow="auto">
					{ isLoading? (
						<Box width="100%" height="80%" display="flex" justifyContent="center" alignItems="center" pt={5}>
							<CircularProgress thickness={ 3 } size="5rem" />
						</Box>
					) : buildings.length > 0 && !isLoading? (
						buildings
							.filter((building: BuildingSelectionInt) => building.building_id !== 39)
							.sort((a: BuildingSelectionInt, b: BuildingSelectionInt) => a.name.localeCompare(b.name))
							.map((building: BuildingSelectionInt) => (
								<Box key={ building.building_id }>
									<BuildingSelItem buildingId={ building.building_id }
									                 buildingName={ building.name }
									                 handleBuildingClick={ handleBuildingClick }
									/>
								</Box>
							))
					) : (
						<Box width="100%"
						     height="80%"
						     display="flex"
						     pt={ 5 }
						     justifyContent="center"
						     alignItems="center">
							<Typography variant="h4" textAlign="center">Nebyly nalezeny žádné budovy!</Typography>
						</Box>
					)
					}
				</Box>
			</Paper>
			<MapButton />
		</Main>
	);
}

export default BuildingSelection;
