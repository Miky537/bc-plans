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
			<Typography overflow="hidden" whiteSpace="nowrap">
				{ room.room_name } - Podlaží: { room.floor_number } -
				Fakulta: { room.faculty }
			</Typography>
		</Box>
	)
}