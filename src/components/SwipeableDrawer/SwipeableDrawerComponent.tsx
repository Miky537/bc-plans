import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React from "react";
import { useTheme, SxProps, Theme, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { RoomDetails } from "../MapComponents/tempFile";
import { serverAddress } from "../../config";


interface SwipeableDrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomInfo: any;
	roomData: RoomDetails;
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
	const {room_info, floor_info, areal_info} = roomData;
	const nazev = room_info?.nazev;
	const mistnostid = room_info?.mistnost_id;
	const podlazi_id = floor_info?.podlazi_id;
	const roomType = room_info?.mistnost_typ_id;
	const label = room_info?.label;
	const areal_name = areal_info?.nazev_puvodni;

	const theme = useTheme();

	const getPhoto = async(name: any) => {
		const token = sessionStorage.getItem('sessionToken');
		const response = await fetch(`https://api.vut.cz/api/nemovitosti/mistnost/1158/fotografie/225211/v1`, {
			method: 'GET',
			headers: {
				'Authorization': `${ token }`,
				'Content-Type': 'application/json',
			},
		});

		if (!response.ok) {
			throw new Error('Search failed');
		}

		return await response.json();
	};



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
			<Box>
				Ahoj tu bude foto
			</Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">name:</Typography><Typography variant="h6">{ nazev }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">podlazi_id:</Typography><Typography variant="h6">{ podlazi_id }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">label:</Typography><Typography variant="h6">{ label }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">Areal name:</Typography><Typography variant="h6">{ areal_name }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">Room Id:</Typography><Typography variant="h6">{ mistnostid }</Typography></Box>			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">roomType</Typography><Typography variant="h6">{ roomType }</Typography></Box>
		</SwipeableDrawer>
	)
}
