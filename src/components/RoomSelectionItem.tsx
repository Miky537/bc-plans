import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FacultyType } from "./FacultySelection/FacultySelection";
import { useFacultyContext } from "./FacultyContext";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";

export interface FavouritePlacesLocalStorage {
	roomName: string;
	roomId: number;
	floorName: string;
	floorNumber: number;
	buildingName: string;
	faculty: FacultyType;
}

interface RoomSelectionItemProps {
	roomName: string;
	roomId: number;
	floorName: string;
	floorNumber: number;
	buildingName: string;
	handleRoomClick: (roomName: string, roomId: number) => void;
}

const RoomSelectionItem = ({
	                           roomName,
	                           roomId,
	                           floorName,
	                           buildingName,
	                           floorNumber,
	                           handleRoomClick
                           }: RoomSelectionItemProps) => {
	const [isFav, setIsFav] = useState<boolean>(false);
	const { selectedFaculty: faculty } = useFacultyContext();

	useEffect(() => {
		const storageKey = 'favoriteRooms';
		const favoriteRoomsString = localStorage.getItem(storageKey);
		const favoriteRooms: FavouritePlacesLocalStorage[] = favoriteRoomsString? JSON.parse(favoriteRoomsString) : [];
		const isFavorite = favoriteRooms.some(room => room.roomId === roomId);
		setIsFav(isFavorite);
	}, [roomId]);

	const toggleFavoriteRoom = (roomToToggle: FavouritePlacesLocalStorage) => {
		const storageKey = 'favoriteRooms';

		const favoriteRoomsString = localStorage.getItem(storageKey);
		let favoriteRooms: FavouritePlacesLocalStorage[] = favoriteRoomsString? JSON.parse(favoriteRoomsString) : [];

		const index = favoriteRooms.findIndex(room => room.roomId === roomToToggle.roomId);

		if (index !== -1) {
			// Room is already a favorite, remove it
			favoriteRooms.splice(index, 1);
			setIsFav(false);
		} else {
			// Room is not a favorite, add it
			favoriteRooms.push(roomToToggle);
			setIsFav(true);
		}
		localStorage.setItem(storageKey, JSON.stringify(favoriteRooms));
	};

	return (
		<Box display="flex"
		     alignItems="center"
		     justifyContent="space-between"
		     // borderTop="1px solid white"
		     borderBottom="1px solid white"
		     py={ 1 }>
			<Typography variant="h6"
			            width="100%"
			            onClick={ () => handleRoomClick(roomName, roomId) }>{ roomName }</Typography>
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
		</Box>
	);
};

export default RoomSelectionItem;
