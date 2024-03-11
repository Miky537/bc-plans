import React, { useState, useCallback, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface RoomData {
	roomName: string;
	roomId: number;
	floorName?: string;
	floorId?: number;
	buildingName?: string;
}

interface RoomSelectionItemProps {
	roomName: string;
	roomId: number;
	floorName?: string;
	buildingName?: string;
	buildingId?: number;
	handleRoomClick: (roomName: string, roomId: number) => void;
}

const RoomSelectionItem = ({ roomName, roomId, floorName, buildingName, handleRoomClick }: RoomSelectionItemProps) => {
	const [isFav, setIsFav] = useState<boolean>(false);

	useEffect(() => {
		const storageKey = 'favoriteRooms';
		const favoriteRoomsString = localStorage.getItem(storageKey);
		const favoriteRooms: RoomData[] = favoriteRoomsString ? JSON.parse(favoriteRoomsString) : [];
		const isFavorite = favoriteRooms.some(room => room.roomId === roomId);
		setIsFav(isFavorite);
	}, [roomId]);

	const toggleFavoriteRoom = (roomToToggle: RoomData): void => {
		console.log('Toggling favorite room', roomToToggle)
		const storageKey = 'favoriteRooms';

		const favoriteRoomsString = localStorage.getItem(storageKey);
		let favoriteRooms: RoomData[] = favoriteRoomsString? JSON.parse(favoriteRoomsString) : [];

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
		     borderTop="1px solid white"
		     py={ 1 }>
			<Typography variant="h6"
			            width="100%"
			            onClick={ () => handleRoomClick(roomName, roomId) }>{ roomName }</Typography>
			<IconButton onClick={() => toggleFavoriteRoom({roomName, roomId, floorName, buildingName})}>
				<FavoriteBorderIcon color="error"
				                    style={ {
					                    fontSize: "1.8rem",
					                    opacity: isFav? 0 : 1,
					                    transition: 'opacity 0.5s',
					                    zIndex: 4
				                    } } />
				<FavoriteIcon color="error"
				              style={ {
					              fontSize: "1.8rem",
					              opacity: isFav? 1 : 0,
					              transition: 'opacity 0.5s',
					              position: 'absolute',
					              zIndex: 4
				              } } />
			</IconButton>
		</Box>
	);
};

export default RoomSelectionItem;
