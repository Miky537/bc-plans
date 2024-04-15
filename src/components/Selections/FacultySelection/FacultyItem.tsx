import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { FacultyType } from "./FacultySelection";
import { useNavigate } from "react-router-dom";
import { useFacultyContext } from "../../../Contexts/FacultyContext";

interface FacultyItemProps {
	name: FacultyType;
	Image?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
}

function FacultyItem({ name, Image }: FacultyItemProps) {
	const navigate = useNavigate();
	const { setSelectedFaculty } = useFacultyContext();

	const handleFacultyClick = (facultyName: FacultyType) => {
		setSelectedFaculty(facultyName);
		navigate(`/${ facultyName }`)
	}

	return (
		<Box display="flex"
		     flexDirection="column"
		     justifyContent="center"
		     alignItems="center"
		     gap={ 2 }
		     onClick={ () => handleFacultyClick(name) } sx={ { cursor: "pointer" } }>
			<Box

				sx={ {
					width: ['25vw', '17vw', '15vw'],
					height: ['25vw', '17vw', '15vw'],
					maxWidth: "10em",
					maxHeight: "10em",
				} }
				borderRadius="20px"
				border="1px solid #384369"
				bgcolor="#24293b"
				display="flex"
				justifyContent="center"
				alignItems="center" overflow="hidden">
				{ Image? <Image style={ { width: "fit" } } /> : null }
			</Box>
		</Box>
	);
}

export default FacultyItem;
