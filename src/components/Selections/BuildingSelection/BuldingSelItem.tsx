import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import React from "react";


interface BuldingSelItemProps {
	buildingId: number;
	buildingName: string;
	handleBuildingClick: (buildingId: number, buildingName: string) => void;
}

export default function BuildingSelItem({ handleBuildingClick, buildingId,buildingName }: BuldingSelItemProps) {


	return (
		<Box width="100%"
		     pt="0.7em"
		     pb="0.7em"
		     bgcolor={ "background.paper" }
		     borderBottom="1px solid white"
		     onClick={ () => handleBuildingClick(buildingId, buildingName) } sx={{cursor: "pointer"}}>
			<Typography variant="h5" ml="0.7em">{ buildingName }</Typography>
		</Box>
	)
}