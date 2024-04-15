import { Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useFacultyContext } from "../Contexts/FacultyContext";


export default function MapButton() {
	const navigate = useNavigate()
	const { selectedFaculty } = useFacultyContext()
	const handleGoToMap = () => {
		navigate(`/map/${ selectedFaculty }`)
	}

	return (
		<Button variant="contained"
		        onClick={ handleGoToMap }
		        sx={ {
			        position: "fixed",
			        bottom: 0,
			        left: "50%",
			        transform: 'translateX(-50%)',
			        width: "100%",
			        maxWidth: "1440px",
			        height: "5em",
			        borderBottomLeftRadius: "0px",
			        borderBottomRightRadius: "0px",
		        } }>
			<Typography variant="h5" sx={ {
				display: "flex",
				alignItems: "center"
			} }>Mapa</Typography>
		</Button>
	)
}