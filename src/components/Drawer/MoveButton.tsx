import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

interface MoveButtonProps {
	toggleDrawerHeight: () => void
	drawerHeight: string;
}

export const MoveButton = ({toggleDrawerHeight, drawerHeight}: MoveButtonProps) => {


	return (
		<IconButton onClick={ toggleDrawerHeight }
		            sx={ {
			            display: "flex",
			            flexDirection: "column",
			            p: "0.1em",
			            bgcolor: "#181f25 !important",
			            borderRadius: "10px",
			            zIndex: 400,
		            } }
		>
			{ drawerHeight === '14em'?
				<ExpandLessIcon color="info" sx={ { fontSize: "3rem", transition: 'opacity 0.2s' } } /> :
				<ExpandMoreIcon color="info" sx={ { fontSize: "3rem", transition: 'opacity 0.2s' } } />
			}
		</IconButton>
	)
}