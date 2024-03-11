import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";
import { useMapContext } from "./MapContext";
import { serverAddress } from "../../config";
import { useFacultyContext } from "../FacultyContext";

const FloorHolder = ({onFloorChange}: any) => {

	const {setFloors, floors} = useMapContext();
	const {selectedFaculty, selectedFloorNumber} = useFacultyContext();

	const handleButtonClick = (floor: number) => {
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
				setFloors([]);
			}
		};

		fetchFloors();
	}, [selectedFaculty, setFloors]);

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
			{floors.map((floor: number, index: number) => (
				console.log("floor", selectedFloorNumber as number),
				<React.Fragment key={floor}>
					<Box display="flex"
					     justifyContent="center"
					     alignItems="center"
					     padding="0.5em"
					     width="1em"
					     fontWeight={selectedFloorNumber === floor ? "bolder" : "normal"}
					     bgcolor={selectedFloorNumber === floor ? "#ABABAB" : "#DBDBDB"}
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
