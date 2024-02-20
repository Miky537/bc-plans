import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import { useMapContext } from "./MapContext";

const FloorHolder = ({onFloorChange, selectedFloor = 2}: any) => {

	const {selectedFaculty, setFloors, floors} = useMapContext();

	const handleButtonClick = (floor: any) => {
		console.log("Selected floor:", floor);
		onFloorChange(floor);
	}

	useEffect(() => {
		const fetchFloors = async () => {
			if (!selectedFaculty) {
				setFloors([]);
				return;
			}
			try {
				const response = await fetch(`http://192.168.0.129:5000/api/floors/${selectedFaculty}`);
				if (!response.ok) throw new Error('Failed to fetch floors');
				const floors: number[] = await response.json();
				setFloors(floors);
			} catch (error) {
				console.error('Error fetching floors:', error);
				setFloors([]); // Optionally handle errors more gracefully
			}
		};

		fetchFloors();
	}, [selectedFaculty, setFloors]); // Dependency array

	return (
		<Box zIndex="10"
		     gap="0.2em"
		     display="flex"
		     flexDirection="column"
		     position="absolute"
		     top="4em"
		     right="1em"
		     bgcolor="#DBDBDB"
			 maxHeight="19.5em"
		     overflow="scroll">
			{floors.map((floor: any, index: number) => (
				<React.Fragment key={floor}>
					<Box display="flex"
					     justifyContent="center"
					     alignItems="center"
					     padding="0.5em"
					     width="1em"
					     fontWeight={selectedFloor === floor ? "bolder" : "normal"}
					     bgcolor={selectedFloor === floor ? "#ABABAB" : "#DBDBDB"}
					     onClick={() => handleButtonClick(floor)}>
						{floor}
					</Box>
					{index !== floors.length - 1 && <Divider flexItem />}
				</React.Fragment>
			))}
		</Box>
	);
};

export default FloorHolder;
