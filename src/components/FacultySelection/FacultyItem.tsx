import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { FacultyType } from "./FacultySelection";
import { useNavigate } from "react-router-dom";
import { useMapContext } from "../MapComponents/MapContext";
import { Coordinates } from "../MapComponents/MapComponent";

interface FacultyItemProps {
	name: FacultyType;
	image?: string;
}

function FacultyItem({name, image}: FacultyItemProps) {
	const navigate = useNavigate();
	const {setCenterCoordinates, centerCoordinates, setSelectedFaculty} = useMapContext();

	const getFacultyCoordinates = (name: FacultyType): { lat: number, lng: number } => {
		if (name === "FIT") return {lat: 16.5960477306341, lng: 49.226545887028706}
		else if (name === "FAST") return {lat: 16.592231660862765, lng: 49.20650409622601}
		else if (name === "FSI") return {lat: 16.57653658893718, lng: 49.22429533272419}
		else if (name === "FEKT") return {lat: 16.575806766341735, lng: 49.22599596291861}
		else if (name === "FAVU") return {lat: 16.59241880634435, lng: 49.19814593252842}
		else if (name === "FCH") return {lat: 16.578578883550467, lng: 49.23125625760177}
		else if (name === "USI") return {lat: 16.578578883550467, lng: 49.23125625760177}
		else if (name === "FP") return {lat: 16.573466531972247, lng: 49.231060330007544}
		else if (name === "FA") return {lat: 16.59381902575785, lng: 49.186889974169276}
		else return {lat: 15, lng: 49}
	}

	const handleFacultyClick = (facultyName: FacultyType, coordinates: Coordinates) => {
		console.log(coordinates)
		setCenterCoordinates(coordinates);
		console.log("center", centerCoordinates)
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
