import React from 'react';
import Main from "../Main/Main";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

interface FacultyItemProps {
	name: string;
	image?: string;
}

function FacultyItem({ name, image } : FacultyItemProps) {

	return (
		<Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={2}>
			<Box width="7em" height="7em" borderRadius="50%" bgcolor="#CDCDCD"></Box>
			<Typography>{name}</Typography>
		</Box>
	);
}

export default FacultyItem;
