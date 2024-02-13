import React from "react";
import './Topbar.tsx.css';
import Box from "@mui/material/Box";
import WestIcon from '@mui/icons-material/West';
import IconButton from "@mui/material/IconButton";
import { useMapContext } from "../MapComponents/MapContext";
import { Typography } from "@mui/material";

interface TopbarProps {
	title?: string;
	goBack?: () => void;
}

export function Topbar({title, goBack}: TopbarProps) {
	const { selectedFaculty } = useMapContext();
	return (
		<div className="Topbar" id="topbar">
			<IconButton sx={{ position: "absolute", left: 0 }} onClick={goBack}>
				<WestIcon sx={ {color: "white"} } />
			</IconButton>
			<Box><Typography variant="h5">{ selectedFaculty }</Typography></Box>
		</div>
	);
}
