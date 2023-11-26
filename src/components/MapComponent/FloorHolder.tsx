import React from 'react';
import Box from '@mui/material/Box';
import { Divider } from "@mui/material";

const FloorHolder = ({floors, onFloorChange, selectedFloor}: any) => {

	const handleButtonClick = (floor: any) => {
		console.log("Selected floor:", floor);
		onFloorChange(floor);
	}

	return (
		<Box zIndex="10"
		     gap="0.2em"
		     display="flex"
		     flexDirection="column"
		     position="absolute"
		     top="1em"
		     right="1em"
		     bgcolor="#DBDBDB">
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
