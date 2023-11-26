import React from 'react';
import Box from '@mui/material/Box';

const FloorHolder = ({floors, onFloorChange}: any) => {

	const handleButtonClick = (floor: any) => {
		console.log("Selected floor:", floor);
		onFloorChange(floor);
	}

	return (
		<Box zIndex="10"
		     gap={ 1 }
		     display="flex"
		     flexDirection="column"
		     position="absolute"
		     top="1em"
		     right="1em"
		     bgcolor="#DBDBDB">
			{ floors.map((floor: any) => (
				<Box display="flex"
				     justifyContent="center"
				     alignItems="center"
				     padding="0.5em"
				     width="1em"
				     key={ floor }
				     onClick={ () => handleButtonClick(floor) }>
					{ floor }
				</Box>
			)) }
		</Box>
	);
};

export default FloorHolder;
