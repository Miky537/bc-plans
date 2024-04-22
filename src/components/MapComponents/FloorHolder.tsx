import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { Button, Divider, Typography } from "@mui/material";
import { useMapContext } from "../../Contexts/MapContext";
import { useFacultyContext } from "../../Contexts/FacultyContext";

const FloorButtonStyles = {
	"&.FloorButton .MuiTouchRipple-root": {
		width: "1em",
	}
}

const FloorHolder = () => {
	const { setFloors, floors } = useMapContext();
	const { selectedFaculty, selectedFloorNumber, setSelectedFloorNumber } = useFacultyContext();
	const containerRef = useRef<HTMLDivElement | null>(null);
	const selectedFloorRef = useRef<HTMLButtonElement | null>(null);

	const handleButtonClick = (floor: number) => {
		setSelectedFloorNumber(floor)
	}

	useEffect(() => {
		// When floors are updated, check if the selected floor button needs to be scrolled into view
		if (selectedFloorRef.current) {
			selectedFloorRef.current!.scrollIntoView({
				behavior: 'smooth',
				block: 'center', // Scroll to make the button centered in the container
			});
		}
	}, [floors, selectedFloorNumber]);

	useEffect(() => {
		const fetchFloors = async() => {
			if (!selectedFaculty) {
				setFloors([]);
				return;
			}
			try {
				const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/floors/${ selectedFaculty }`);
				if (!response.ok) throw new Error('Failed to fetch floors');
				const floors: number[] = await response.json();
				setFloors(floors);
			} catch (error) {
				console.error('Error fetching floors:', error);
				setFloors([]);
			}
		};

		fetchFloors();
	}, [selectedFaculty, setFloors]);

	return (
		<Box ref={ containerRef }
		     id="Floor-Holder"
		     zIndex="2"
		     gap="0.2em"
		     borderRadius="3px"
		     display={ floors.length === 0? "none" : "flex" }
		     flexDirection="column-reverse"
		     position="absolute"
		     top="4em"
		     right="1em"
		     boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
		     bgcolor="#DBDBDB"
		     sx={ { maxHeight: { xs: "18.5em", md: "30em" } } }
		     overflow="auto">
			{ floors.map((floor: number, index: number) => (
				<React.Fragment key={ floor }>
					<Button ref={ selectedFloorNumber === floor? selectedFloorRef : null }
					        className="FloorButton"
					        onClick={ () => handleButtonClick(floor) }
					        sx={ {
						        display: "flex",
						        justifyContent: "center",
						        alignItems: "center",
						        padding: "0.5em",
						        width: "1em",
						        minWidth: "2.5em",
						        maxWidth: "2.5em",
						        fontWeight: selectedFloorNumber === floor? "bolder" : "normal",
						        bgcolor: selectedFloorNumber === floor? "#ABABAB !important" : "#DBDBDB",
						        ...FloorButtonStyles,
					        } }>
						<Typography sx={ { fontWeight: selectedFloorNumber === floor? "900" : "normal" } }>{ floor }</Typography>
					</Button>
					{ index !== floors.length - 1 && <Divider flexItem /> }
				</React.Fragment>
			)) }
		</Box>
	);
};

export default FloorHolder;
