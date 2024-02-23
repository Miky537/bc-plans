import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { FacultyType } from "./FacultySelection";
import { useNavigate, useLocation } from "react-router-dom";
import { useMapContext } from "../MapComponents/MapContext";
import { Coordinates } from "../MapComponents/MapComponent";
import { getFacultyCoordinates } from "../MapComponents/MapFunctions";

interface FacultyItemProps {
	name: FacultyType;
	image?: string;
}

function FacultyItem({name, image}: FacultyItemProps) {
	const navigate = useNavigate();
	const {setCenterCoordinates, setSelectedFaculty} = useMapContext();

	const handleFacultyClick = (facultyName: FacultyType, coordinates: Coordinates) => {
		setCenterCoordinates(coordinates);
		setSelectedFaculty(facultyName);
		navigate(`/${ facultyName }`)
	}

	return (
		<Box display="flex"
		     flexDirection="column"
		     justifyContent="center"
		     alignItems="center"
		     gap={ 2 }
		     onClick={ () => handleFacultyClick(name, getFacultyCoordinates(name)) } sx={ {cursor: "pointer"} }>
			<Box width="7em" height="7em" borderRadius="50%" bgcolor="#CDCDCD"></Box>
			<Typography>{ name.toString() }</Typography>
		</Box>
	);
}

export default FacultyItem;
