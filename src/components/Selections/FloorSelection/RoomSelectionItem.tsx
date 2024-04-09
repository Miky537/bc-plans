import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { FacultyType } from "../FacultySelection/FacultySelection";
import { useFacultyContext } from "../../../Contexts/FacultyContext";
import FavIconButton from "./FavIconButton";

export interface FavouritePlacesLocalStorage {
	roomName: string | null;
	roomId: number;
	floorName: string;
	floorNumber: number;
	buildingName: string | null;
	faculty: FacultyType;
}

interface RoomSelectionItemProps {
	roomName: string | null;
	roomId: number;
	floorName: string;
	floorNumber: number;
	buildingName: string;
	handleRoomClick: (roomName: string | null, roomId: number) => Promise<void>;
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
		     borderTop="1px solid gray"
		     py={ 1 }>
			<Typography variant="h6"
			            width="100%"
			            onClick={ () => handleRoomClick(roomName, roomId) }>{ roomName }</Typography>
			<FavIconButton roomName={ roomName }
			               roomId={ roomId }
			               floorName={ floorName }
			               floorNumber={ floorNumber }
			               buildingName={ buildingName }
			               faculty={ faculty }
			               toggleFavoriteRoom={ toggleFavoriteRoom }
			               isFav={ isFav }
			/>
		</Box>
	);
};

export default RoomSelectionItem;
