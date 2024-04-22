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
			<Typography sx={{display: "flex", alignItems: "center"}}>
				<Typography variant="body1">{room.roomName}&nbsp;-&nbsp;</Typography>
				<Typography variant="body2"> podlaží {room.floorNumber}&nbsp;-&nbsp;</Typography>
				<Typography variant="body2"> {room.buildingName}&nbsp;-&nbsp;</Typography>
				<Typography variant="body2"> {room.faculty}</Typography>
			</Typography>
		</Box>
	)
}