import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import { useMapContext } from "./MapContext";
import { serverAddress } from "../../config";
import { useFacultyContext } from "../FacultyContext";

const FloorHolder = ({onFloorChange, selectedFloor}: any) => {

	const { setFloors, floors} = useMapContext();
	const {selectedFaculty} = useFacultyContext();

	const handleButtonClick = (floor: any) => {
		onFloorChange(floor);
	}

	useEffect(() => {
		const fetchFloors = async () => {
			if (!selectedFaculty) {
				setFloors([]);
				return;
			}
			try {
				const response = await fetch(`${serverAddress}/api/floors/${selectedFaculty}`);
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
		<Box zIndex="2"
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
