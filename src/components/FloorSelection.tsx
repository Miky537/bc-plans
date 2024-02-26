import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import { Typography, AccordionSummary, Accordion, AccordionDetails, Breadcrumbs, Link } from "@mui/material";
import { useFacultyContext } from "./FacultyContext";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from "react-router-dom";

interface FloorSelection {
	floor_id: number;
	floor_number: number;
	floor_name: string;
	rooms: any;
}

const czechCharMap: { [key: string]: string | undefined } = { // Map of Czech characters to their English counterparts
	'á': 'a', 'č': 'c', 'ď': 'd', 'é': 'e', 'ě': 'e', 'í': 'i',
	'ň': 'n', 'ó': 'o', 'ř': 'r', 'š': 's', 'ť': 't', 'ú': 'u',
	'ů': 'u', 'ý': 'y', 'ž': 'z',
	// Add uppercase versions if necessary
	'Á': 'A', 'Č': 'C', 'Ď': 'D', 'É': 'E', 'Ě': 'E', 'Í': 'I',
	'Ň': 'N', 'Ó': 'O', 'Ř': 'R', 'Š': 'S', 'Ť': 'T', 'Ú': 'U',
	'Ů': 'U', 'Ý': 'Y', 'Ž': 'Z'
};

const replaceCzechChars = (str: string) => {
	return str.split('').map((char: string) => czechCharMap[char] || char).join('');
};

const accordionStyles = {
	'& .MuiAccordionSummary-expandIconWrapper': {
		color: 'white',
	}
};

function FloorSelection() {
	const [floors, setFloors] = useState([]);
	const { selectedBuildingId, setSelectedBuildingId } = useFacultyContext();
	const [expanded, setExpanded] = useState<string | false>(false);
	const [oldSelectedPanel, setOldSelectedPanel] = useState<string | undefined>(undefined);
	const navigate = useNavigate();
	const { faculty, building, floor } = useParams();
	const {
		selectedFaculty,
		selectedBuilding,
		selectedFloor,
		setSelectedFloor,
		setSelectedRoomId,
		handleRoomSelection
	} = useFacultyContext();

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		if (oldSelectedPanel === panel) {
			setOldSelectedPanel(undefined);
			setSelectedFloor(undefined);
		}
		if (oldSelectedPanel === undefined) {
			setOldSelectedPanel(panel);
			setSelectedFloor(panel);
		}

		setExpanded(isExpanded ? panel : false);
		console.log("Tuto:", expanded ? undefined : panel)
		// setSelectedFloor(expanded ? undefined : panel);
		if (isExpanded) {
			const tempString = panel.replace(/\s/g, "_"); // Replace spaces with underscores
			const floorName = replaceCzechChars(tempString); // Assuming you have a function to replace Czech chars
			navigate(`/${ faculty }/${ building }/${ floorName }`, { replace: true });
		}
	};


	useEffect(() => {
		if (selectedBuildingId === null) return
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
			.catch(error => console.log("Fetching floors failed: ", error));
	}, [selectedBuildingId]);

	const handleRoomClick = async(roomName: string, roomId: number) => {
		await setSelectedRoomId(roomId);
		await handleRoomSelection(roomId);
		setSelectedFloor(undefined);
		navigate(`/FAST/${ building }/${floor}/${roomName}`);
	};

	return (
		<Main>
			<Breadcrumbs separator="›">
				<Link><Typography variant="h5">{ selectedFaculty }</Typography></Link>
				<Link><Typography variant="h5">{ selectedBuilding }</Typography></Link>
				<Link><Typography variant="h5">{ selectedFloor }</Typography></Link>
			</Breadcrumbs>
			<Box display="flex"
			     flexDirection="column"
			     justifyContent="flex-start"
			     height="100%"
			     width="100%"
			     pt={ 4 }
			     pb={ 4 }
			     bgcolor="#323232"
			     color="white">
				{ floors.length > 0? (
					floors.map((floor: FloorSelection, index) => (
						<Accordion key={ floor.floor_id }
						           expanded={ expanded === floor.floor_name }
						           onChange={ handleChange(floor.floor_name) }
						           sx={accordionStyles}
						>
							<AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
								<Typography variant="h5">{ floor.floor_name }</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<Box>
									{ floor.rooms.map((room: any) => (
										<Typography key={ room.room_id } variant="h6"
										            onClick={() => {
											            handleRoomClick(room.room_number, room.room_id);
										            }}>
											{ room.name }
										</Typography>
									)) }
								</Box>
							</AccordionDetails>
						</Accordion>
					))
				) : (
					<Typography>No floors found for the selected building.</Typography>
				) }
			</Box>
		</Main>
	);
}

export default FloorSelection;
