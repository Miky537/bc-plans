import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React from "react";
import { useTheme, SxProps, Theme, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { InfoState } from "../MapComponents/MapHolder";


interface SwipeableDrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomInfo: any;
	roomData: InfoState;
}
const mergeStylesWithTheme = (theme: Theme): SxProps => {
	return {
		"& .MuiDrawer-paper.MuiDrawer-paperAnchorBottom": {
			height: "30%",
			borderRadius: "40px 40px 0px 0px",
			padding: "2em 1em 1em 1em",
			backgroundColor: theme.palette.background.default,
			// position: "relative",
		},
	};
};


export function SwipeableDrawerComponent({
	                                         isDrawerOpen,
	                                         onClose,
	                                         onOpen,
	                                         roomInfo,
	                                         roomData
                                         }: SwipeableDrawerComponentProps) {
	const {room, floor} = roomData;
	const nazev = room?.nazev;
	const podlazi_id = floor?.podlazi_id;
	const label = room?.label;

	const theme = useTheme();
	return (
		<SwipeableDrawer
			anchor="bottom"
			open={ isDrawerOpen }
			onClose={ onClose }
			onOpen={ onOpen }
			sx={ mergeStylesWithTheme(theme) }
		>
			<Box position="absolute"
			     top="1em"
			     left="25%"
			     borderTop="5px solid #ABABAB"
			     height="1px"
			     width="50%"
			     display="flex"></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">name:</Typography><Typography variant="h6">{ nazev }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">podlazi_id:</Typography><Typography variant="h6">{ podlazi_id }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">label:</Typography><Typography variant="h6">{ label }</Typography></Box>
		</SwipeableDrawer>
	)
}
