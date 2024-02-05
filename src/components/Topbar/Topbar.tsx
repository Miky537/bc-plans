import React from "react";
import './Topbar.tsx.css';
import Box from "@mui/material/Box";
import WestIcon from '@mui/icons-material/West';
import IconButton from "@mui/material/IconButton";

interface TopbarProps {
	title?: string;
	goBack?: () => void;
}

export function Topbar({title, goBack}: TopbarProps) {
	return (
		<div className="Topbar">
			<IconButton sx={{ position: "absolute", left: 0 }} onClick={goBack}>
				<WestIcon sx={ {color: "white"} } />
			</IconButton>
			<Box>{ title ?? '' }</Box>
		</div>
	);
}
