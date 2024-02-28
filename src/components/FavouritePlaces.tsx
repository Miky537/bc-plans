import React from 'react';
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useFacultyContext } from "./FacultyContext";
import { useNavigate } from "react-router-dom";
import { replaceCzechChars } from "./FloorSelection";

interface FavouritePlacesLocalStorage {
	roomName: string;
	roomId: number;
	floorName: string;
	buildingName: string;
}

function FavouritePlaces() {
	const navigate = useNavigate();
	const { handleRoomSelection, setSelectedRoomId, selectedFloor } = useFacultyContext();
	const items = localStorage.getItem('favoriteRooms');
	let mappedItems;
	if (items) {
		mappedItems = JSON.parse(items);
		console.log("Mapped items: ", mappedItems);
	} else {
		mappedItems = [];
	}
	const handleRoomClick = async({ roomName, roomId, buildingName, floorName }: FavouritePlacesLocalStorage) => {
		console.log("Room clicked: ", roomName, roomId);
		setSelectedRoomId(roomId);
		handleRoomSelection(roomId);
		// setSelectedFloor(selectedFloor);
		const normalizedBuildingName = replaceCzechChars(buildingName)!.replace(/\s/g, "_");
		const normalizedFloorName = replaceCzechChars(floorName)!.replace(/\s/g, "_");
		navigate(`/FAST/${ normalizedBuildingName }/${ normalizedFloorName }/${ roomName }`);
	};

	return (
		<Box display="flex"
		     flexDirection="column"
		     bgcolor="#212121"
		     justifyContent="flex-start"
		     height="100%"
		     width="100%">
			<Typography variant="h4" textAlign="center" mt={ 4 } mb={ 4 } color="white">Favourite Places</Typography>
			<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white">
				<Box width="100%" bgcolor="#424242" color="white">
					{ mappedItems.length > 0? (
						mappedItems.map((item: FavouritePlacesLocalStorage, index: number) => (
							<Box key={ item.roomId }
							     display="flex"
							     pl="1em"
							     pr="1em"
							     pt="0.7em"
							     pb="0.7em"
							     borderTop="1px solid white"
							     borderBottom="1px solid white"
							     onClick={ () => handleRoomClick(item) }>
								<Typography variant="h5" flexGrow={ 1 }>{ item.roomName }</Typography>
								<Typography variant="h5">{ item.floorName }</Typography>
							</Box>
						))
					) : (
						<Typography>No favourite places found.</Typography>
					) }
				</Box>
			</Box>
		</Box>
	);
}

export default FavouritePlaces;
