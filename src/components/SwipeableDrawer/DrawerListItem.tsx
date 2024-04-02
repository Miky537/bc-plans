import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

interface DrawerListItemProps {
	text: number | string | null;
	desc?: string;
}

function DrawerListItem({ text, desc }: DrawerListItemProps) {

	return (
		<Box display={text? "flex" : "none"} alignItems="center">
			{ desc && <Typography sx={{flexGrow: 1}} variant="h5">{ desc }</Typography> }
			<Typography variant="h5">{text}</Typography>
		</Box>
	);
}

export default DrawerListItem;
