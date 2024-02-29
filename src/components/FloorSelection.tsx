import React, { useState, useEffect, useCallback } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import {
	Typography,
	AccordionSummary,
	Accordion,
	AccordionDetails,
	Breadcrumbs,
	Link,
	useTheme,
	CircularProgress
} from "@mui/material";
import { useFacultyContext } from "./FacultyContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom";
import RoomSelectionItem from "./RoomSelectionItem";

export interface FetchedFloor {
	building_id?: number;
	building_name: string;
	floor_id: number;
	floor_name: string;
	floor_number?: number;
	rooms?: any;
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

export const replaceCzechChars = (str: string | undefined): string => {
	if (!str) return "";
	return str.split('').map((char: string) => czechCharMap[char] || char).join('');
};

const accordionStyles = {
	'& .MuiAccordionSummary-expandIconWrapper': {
		color: 'white',
	}
};


function FloorSelection() {
	const { palette } = useTheme();
	const [floors, setFloors] = useState<FetchedFloor[]>([]);
	const { selectedBuildingId } = useFacultyContext();
	const [expanded, setExpanded] = useState<string | false>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate();
	const { building, floor } = useParams();
	const {
		selectedFaculty,
		selectedBuilding,
		selectedFloor,
		setSelectedFloor,
		setSelectedRoomId,
		handleRoomSelection
	} = useFacultyContext();

	const handleChange = useCallback(
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			console.log("Panel: ", panel, " isExpanded: ", isExpanded);
			setExpanded(isExpanded? panel : false);
			setSelectedFloor(isExpanded? panel : undefined);
			const selectedFloorLocal = replaceCzechChars(panel)!.replace(/\s/g, "_");
			if (panel && isExpanded) {
				navigate(`/${ selectedFaculty }/${ building }/${ selectedFloorLocal }`, { replace: true });
			} else {
				navigate(`/${ selectedFaculty }/${ building }`, { replace: true });
			}
		},
		[navigate, selectedFaculty, building] // Ensure all dependencies are listed here
	);


	useEffect(() => {
		if (selectedBuildingId === null) return
		setIsLoading(true);
		const url = `${ serverAddress }/api/floors/FAST/${ selectedBuildingId }`;

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
			.catch(error => console.log("Fetching floors failed: ", error))
			.finally(() => setIsLoading(false));
	}, [selectedBuildingId]);

	const handleRoomClick = async(roomName: string, roomId: number) => {
		console.log("Room clicked: ", roomName, roomId);
		setSelectedRoomId(roomId);
		handleRoomSelection(roomId);
		// setSelectedFloor(selectedFloor);
		navigate(`/FAST/${ building }/${ floor }/${ roomName }`);
	};

	return (
		<Main>
			<Breadcrumbs separator="›" sx={ { bgcolor: palette.background.default, py: 1, } }>
				<Link underline="hover"><Typography variant="h5">{ selectedFaculty }</Typography></Link>
				<Link underline="hover"><Typography variant="h5">{ selectedBuilding }</Typography></Link>
				<Link underline="hover"><Typography variant="h5">{ selectedFloor }</Typography></Link>
			</Breadcrumbs>
			<Box display="flex"
			     flexDirection="column"
			     justifyContent="flex-start"
			     height="100%"
			     width="100%"
			     pb={ 4 }
			     bgcolor="#323232"
			     borderTop="2px solid gray"
			     color="white">
				{ floors.length > 0 && !isLoading? (
					floors.map((floor: FetchedFloor, index) => (
						<Accordion key={ floor.floor_id }
						           expanded={ expanded === floor.floor_name }
						           onChange={ handleChange(floor.floor_name) }
						           sx={accordionStyles}
						           disableGutters
						>
							<AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
								<Typography variant="h5">{ floor.floor_name }</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Box>
									{ floor.rooms.map((room: any) => (

										<Box key={ room.room_id }>
											<RoomSelectionItem handleRoomClick={ handleRoomClick }
											                   buildingName={ floor.building_name }
											                   floorName={ floor.floor_name }
											                   roomName={ room.room_number }
											                   roomId={ room.room_id } />
										</Box>

									)) }
								</Box>
							</AccordionDetails>
						</Accordion>
					))
				) : (
					<Box width="100%" height="80%" display="flex" justifyContent="center" alignItems="center">
						<CircularProgress thickness={ 3 } size="5rem" />
					</Box>
				) }
			</Box>
		</Main>
	);
}

export default FloorSelection;
