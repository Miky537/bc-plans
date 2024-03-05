import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { FacultyType } from "./FacultySelection";
import { useNavigate } from "react-router-dom";
import { useMapContext } from "../MapComponents/MapContext";
import { Coordinates } from "../MapComponents/MapComponent";
import { getFacultyCoordinates } from "../MapComponents/MapFunctions";
import { useFacultyContext } from "../FacultyContext";
import { ReactComponent as FitLogo } from "../../FacultyLogos/fit-logo.svg";

interface FacultyItemProps {
	name: FacultyType;
	Image?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

function FacultyItem({ name, Image }: FacultyItemProps) {
	const navigate = useNavigate();
	const { setCenterCoordinates } = useMapContext();
	const { setSelectedFaculty } = useFacultyContext();

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
			<Box width="7em"
			     height="7em"
			     borderRadius="50%"
			     bgcolor="#DEDEDE"
			     display="flex"
			     justifyContent="center"
			     alignItems="center" overflow="hidden">
				{Image ? <Image style={{ width: "8em" }} /> : null}
			</Box>

			<Typography>{ name?.toString() }</Typography>
		</Box>
	);
}

export default FacultyItem;
