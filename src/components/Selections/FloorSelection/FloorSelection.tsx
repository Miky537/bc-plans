import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "../../Main/Main";
import { Typography, Breadcrumbs, Link, useTheme, CircularProgress } from "@mui/material";
import { useFacultyContext } from "../../../Contexts/FacultyContext";
import { useParams, useNavigate } from "react-router-dom";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FloorSelItem from "./FloorSelItem";
import MapButton from "../../MapButton";

export interface FetchedFloorRoomType {
	name: string | null;
	room_id: number;
	room_number: string | null;
}

export interface FetchedFloor {
	building_id?: number;
	building_name: string;
	floor_id: number;
	floor_name: string;
	floor_number: number;
	rooms?: FetchedFloorRoomType[];
	roomId?: number;
}

export const czechCharMap: { [key: string]: string | undefined } = { // Map of Czech characters to their English counterparts
	'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i',
	'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u',
	'ů': 'u', 'ý': 'y', 'ž': 'z',
	// Add uppercase versions if necessary
	'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I',
	'Ň': 'N', 'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U',
	'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
};

export const replaceCzechChars = (str: string | null): string => {
	if (!str) return "";
	return str.split('').map((char: string) => czechCharMap[char] || char).join('');
};


function FloorSelection() {
	const theme = useTheme();
	const [floors, setFloors] = useState<FetchedFloor[]>([]);
	const [expanded, setExpanded] = useState<string | false>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState(false);
	const navigate = useNavigate();
	const { floor } = useParams();
	const {
		selectedFaculty,
		selectedBuilding,
		selectedFloor,
		setSelectedRoomId,
		handleRoomSelection,
		setSelectedFloorNumber,
		selectedBuildingId,
		setFacultyChangeSource,
	} = useFacultyContext();

	useEffect(() => {
		if (selectedBuildingId === null) return
		setIsLoading(true);
		const url = `${ process.env.REACT_APP_BACKEND_URL }/api/floors/${ selectedFaculty }/${ selectedBuildingId }`;

		// Fetch buildings data from the API
		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${ response.status }`);
				}
				return response.json();

			})
			.then(data => {
				setFloors(data)
			})
			.catch(error => setError(true))
			.finally(() => setIsLoading(false));
	}, [selectedBuildingId]);

	function extractNumberFromString(input: string | undefined): number | null {
		if (!input) return null;
		const match = input.match(/\d+/);
		if (match) {
			return parseInt(match[0], 10);
		}
		return null;
	}


	const handleRoomClick = async(roomName: string | null, roomId: number) => {
		setFacultyChangeSource('search');
		await setSelectedRoomId(roomId);
		const selectedFloorNumberLocal = extractNumberFromString(floor);
		if (selectedFloorNumberLocal === null || !roomName) return;
		await setSelectedFloorNumber(selectedFloorNumberLocal);
		await handleRoomSelection(roomId);
		navigate(`/map/${ selectedFaculty }/${ selectedBuilding!.replace(/\s/g, "_") }/${ floor }/${ roomName }`);
	};
	const handleGoBuildingSelection = () => {
		navigate(`/${ selectedFaculty }`);
	}
	const handleGoFloorSelection = () => {
		setExpanded(false);
	}

	return (
		<Main topBarSelectedDisabled>
			<Box maxWidth="1440px"
			     margin="auto"
			     height="100%"
			     minHeight="fit-content"
			     width="100%"
			     mb="calc(5em - 12px)"
			     position="relative"
			     overflow="auto">
				<Box sx={ { position: 'sticky', top: 0, zIndex: 1, borderBottom: "2px solid white" } }>
					<Breadcrumbs separator={ <NavigateNextIcon fontSize="medium" /> }
					             sx={ {
						             position: "sticky",
						             bgcolor: theme.palette.background.default,
						             py: 1,
						             pl: 2,
					             } }>
						<Link underline="hover" onClick={ handleGoBuildingSelection }>
							<Typography variant="h5">{ selectedFaculty }</Typography>
						</Link>
						<Link underline="hover" onClick={ handleGoFloorSelection }>
							<Typography variant="h5">{ selectedBuilding }</Typography>
						</Link>
						<Link underline="hover">
							<Typography variant="h5">{ selectedFloor }</Typography>
						</Link>
					</Breadcrumbs>
				</Box>
				<Box display="flex"
				     flexDirection="column"
				     justifyContent="flex-start"
				     maxWidth="1440px"
				     pb={ 4 }
				     color={ theme.palette.text.primary }>
					{error ? (
						<Box width="100%" height="80%" mt={5} display="flex" justifyContent="center" alignItems="center">
							<Typography variant="h6">Nebyla nelezna požadovaná podlaží!</Typography>
						</Box>
					) : floors.length > 0 && !isLoading ? (
						floors
							.sort((a: FetchedFloor, b: FetchedFloor) => a.floor_number - b.floor_number)
							.map((floor: FetchedFloor) => (
								<Box key={floor.floor_id}>
									<FloorSelItem floor={floor}
									              setExpanded={setExpanded}
									              expanded={expanded}
									              handleRoomClick={handleRoomClick} />
								</Box>
							))
					) : (
						<Box width="100%" height="80%" display="flex" justifyContent="center" alignItems="center" pt={5}>
							<CircularProgress thickness={3} size="5rem" />
						</Box>
					)}
				</Box>
			</Box>
			<MapButton />
		</Main>
	);
}

export default FloorSelection;
