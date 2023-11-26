import React from 'react';
import Box from "@mui/material/Box";

interface ContentProps {
	children: React.ReactNode;
}

export default function Content({children}: ContentProps) {
	return (
		<Box display="flex" flexGrow="1" flexDirection="column">
			{ children }
		</Box>
	);
}
