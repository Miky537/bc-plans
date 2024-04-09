import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import React from "react";
import { FavouritePlacesLocalStorage } from "../Selections/FloorSelection/RoomSelectionItem";

interface FavIconButtonProps extends FavouritePlacesLocalStorage{
 	toggleFavoriteRoom: (room: FavouritePlacesLocalStorage) => void
	isFav: boolean
}

export const FavIconButton = ({
	                              toggleFavoriteRoom,
	                              roomId,
	                              floorName,
	                              roomName,
	                              buildingName,
	                              faculty,
	                              floorNumber,
	                              isFav
                              }: FavIconButtonProps) => {


	return (
		<IconButton onClick={ () => toggleFavoriteRoom({
			roomName,
			roomId,
			floorName,
			floorNumber,
			buildingName,
			faculty
		}) } sx={ {
			bgcolor: "#181f25 !important", p: { sx: 0, sm: "0.1em" },
			borderRadius: "10px"
		} }>
			<StarBorderIcon color="primary"
			                sx={ {
				                fontSize: { xs: "2.5rem", sm: "3rem" },
				                opacity: isFav? 0 : 1,
				                transition: 'opacity 0.2s',
				                zIndex: 4
			                } } />
			<StarIcon color="primary"
			          sx={ {
				          fontSize: { xs: "2.5rem", sm: "3rem" },
				          opacity: isFav? 1 : 0,
				          transition: 'opacity 0.2s',
				          position: 'absolute',
				          zIndex: 4
			          } } />
		</IconButton>
	)
}