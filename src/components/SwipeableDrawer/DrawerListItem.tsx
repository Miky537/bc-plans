import React from 'react';
import Box from "@mui/material/Box";
import { Typography, TypographyProps, useTheme } from "@mui/material";

interface DrawerListItemProps {
	text: number | string | null;
	desc?: string;
	variant?: TypographyProps['variant'];
}

function DrawerListItem({ text, desc, variant = "h5" }: DrawerListItemProps) {

	const theme = useTheme();

	return (
		<Box display={ text? "flex" : "none" } alignItems="center" width="100%">
			{ desc && <Typography whiteSpace="nowrap"
			                      flexGrow={ 1 }
								  sx={ { width: "8em", pr: 1, color: theme.palette.text.secondary } }
								  variant="h6">{ desc }</Typography> }
			<Typography whiteSpace="nowrap" textAlign="left" variant={ variant }>{ text }</Typography>
		</Box>
	);
}

export default DrawerListItem;
