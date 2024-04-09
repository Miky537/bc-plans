import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { IconButton } from "@mui/material";
import React from "react";
import { FacultyType } from "../FacultySelection/FacultySelection";
import { FavouritePlacesLocalStorage } from "./RoomSelectionItem";


interface FavIconButtonProps {
	roomName: string | null;
	roomId: number;
	floorName: string;
	floorNumber: number;
	buildingName: string | null;
	faculty: FacultyType;
	toggleFavoriteRoom: (roomToToggle: FavouritePlacesLocalStorage) => void;
	isFav: boolean;
}

export default function FavIconButton({
	                                      roomName,
	                                      roomId,
	                                      floorName,
	                                      buildingName,
	                                      faculty,
	                                      floorNumber,
	                                      toggleFavoriteRoom,
										  isFav,
                                      }: FavIconButtonProps) {


	return (
		<IconButton onClick={ () => toggleFavoriteRoom({
			roomName,
			roomId,
			floorName,
			buildingName,
			faculty,
			floorNumber
		}) }>
			<StarBorderIcon color="primary"
			                style={ {
				                fontSize: "2rem",
				                opacity: isFav? 0 : 1,
				                transition: 'opacity 0.5s',
			                } } />
			<StarIcon color="primary"
			          style={ {
				          fontSize: "2rem",
				          opacity: isFav? 1 : 0,
				          transition: 'opacity 0.5s',
				          position: 'absolute',
			          } } />
		</IconButton>
	)
}