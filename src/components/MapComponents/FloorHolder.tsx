import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import { useMapContext } from "./MapContext";
import { useFacultyContext } from "../FacultyContext";

const FloorHolder = () => {

	const { setFloors, floors } = useMapContext();
	const { selectedFaculty, selectedFloorNumber, setSelectedFloorNumber } = useFacultyContext();

	const handleButtonClick = (floor: number) => {
		setSelectedFloorNumber(floor)
	}

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
		<Box zIndex="2"
		     gap="0.2em"
		     display={ floors.length === 0 ? "none" : "flex" }
		     flexDirection="column"
		     position="absolute"
		     top="4em"
		     right="1em"
		     boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
		     bgcolor="#DBDBDB"
		     maxHeight="18.5em"
		     overflow="scroll">
			{ floors.map((floor: number, index: number) => (
				<React.Fragment key={ floor }>
					<Box display="flex"
					     justifyContent="center"
					     alignItems="center"
					     padding="0.5em"
					     width="1em"
					     fontWeight={ selectedFloorNumber === floor? "bolder" : "normal" }
					     bgcolor={ selectedFloorNumber === floor? "#ABABAB" : "#DBDBDB" }
					     onClick={ () => handleButtonClick(floor) }>
						{ floor }
					</Box>
					{ index !== floors.length - 1 && <Divider flexItem /> }
				</React.Fragment>
			)) }
		</Box>
	);
};

export default FloorHolder;
