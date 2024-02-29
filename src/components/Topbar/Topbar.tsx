import React, { useState, useEffect } from "react";
import './Topbar.tsx.css';
import Box from "@mui/material/Box";
import WestIcon from '@mui/icons-material/West';
import IconButton from "@mui/material/IconButton";
import { useMapContext } from "../MapComponents/MapContext";
import { Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { FacultyType } from "../FacultySelection/FacultySelection";

interface TopbarProps {
	title?: string;
	goBack?: () => void;
}

export function Topbar({title, goBack}: TopbarProps) {
	const [displayTitle, setDisplayTitle] = useState<FacultyType | string>("");
	const location = useLocation();
	const { selectedFaculty } = useMapContext();

	const isOnFacultyPage = location.pathname === '/faculty';
	const isOnFavPlacesPage = location.pathname === '/fvPlaces';
	useEffect(() => {

		if (isOnFacultyPage) {
			setDisplayTitle("Select faculty");
		} else if (isOnFavPlacesPage) {
			setDisplayTitle("Favourite places");
		} else {
			setDisplayTitle(selectedFaculty || title);
		}
	}, [location.pathname, selectedFaculty, title]); // Dependency array

	return (
		<div className="Topbar" id="topbar">
			<IconButton sx={ { position: "absolute", left: 0, display: !isOnFacultyPage ? "inline" : "none" } }
			            onClick={ goBack }>
				<WestIcon sx={ {color: "white"} } />
			</IconButton>
			<Box><Typography variant="h5">{ displayTitle }</Typography></Box>
		</div>
	);
}
