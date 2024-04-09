import Box from "@mui/material/Box";
import { searchBoxStyle } from "./styles";
import StarIcon from "@mui/icons-material/Star";
import { Typography } from "@mui/material";
import React from "react";
import { FavouritePlacesLocalStorage } from "../Selections/FloorSelection/RoomSelectionItem";

interface FavItemProps {
	room: FavouritePlacesLocalStorage;
	handleFavouriteRoomClick: (room: FavouritePlacesLocalStorage, event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function FavItem({room, handleFavouriteRoomClick}: FavItemProps) {



	return (
		<Box sx={ searchBoxStyle }
		     onClick={ (event) => handleFavouriteRoomClick(room, event) }>
			<StarIcon color="info" />
			<Typography overflow="hidden" whiteSpace="nowrap">
				{ room.roomName } - Podlaží: { room.floorNumber } -
				Fakulta: { room.faculty }
			</Typography>
		</Box>
	)
}