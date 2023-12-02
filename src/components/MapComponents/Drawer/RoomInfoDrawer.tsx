import React from 'react';
import Box from '@mui/material/Box';

const RoomInfoDrawer = ({roomInfo, onClose}: any) => {


	return (
		<Box zIndex="10"
		     position="absolute"
		     bottom="3em"
		     gap="0.2em"
		     display="flex"
		     bgcolor="#DBDBDB">
			yoyoyo
			<button onClick={onClose}>Close</button>
		</Box>
	);
};

export default RoomInfoDrawer;
