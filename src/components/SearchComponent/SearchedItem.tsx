import Box from "@mui/material/Box";
import { searchBoxStyle } from "./styles";
import HistoryIcon from "@mui/icons-material/History";
import { Typography } from "@mui/material";
import React from "react";
import { RoomNames } from "./SearchComponent";

interface SearchedItemProps {
	room: RoomNames;
	handleRoomSearchClick: (room: RoomNames, event: React.MouseEvent) => void;
}

export default function SearchedItem({handleRoomSearchClick, room}: SearchedItemProps) {


	return (
		<Box sx={ searchBoxStyle }
		     onClick={ (event) => handleRoomSearchClick(room, event) }>
			<HistoryIcon color="info" />
			<Typography sx={{display: "flex", alignItems: "center"}}>
				<Typography variant="body1">{room.room_name}&nbsp;-&nbsp;</Typography>
				<Typography variant="body2"> podlaží {room.floor_number}&nbsp;-&nbsp;</Typography>
				<Typography variant="body2"> {room.building_name}&nbsp;-&nbsp;</Typography>
				<Typography variant="body2"> {room.faculty}</Typography>
			</Typography>
		</Box>
	)
}