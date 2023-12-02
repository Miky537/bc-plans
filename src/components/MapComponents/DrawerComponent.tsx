import React, { useEffect } from "react";
import Box from "@mui/material/Box";

export default function DrawerComponent({roomData}: any) {

	useEffect(() => {
	}, [roomData]);
	return (
		<Box display="flex" justifyContent="center" height="100px" className="HEREEEEEEEEE">
			<div>{ roomData.číslo_podlaží }</div>
		</Box>
	);
}
