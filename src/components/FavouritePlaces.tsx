import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import { Typography, Divider, Paper } from "@mui/material";
import { useFacultyContext } from "../Contexts/FacultyContext";
import { useNavigate } from "react-router-dom";
import { replaceCzechChars } from "./FloorSelection";
import { FavouritePlacesLocalStorage } from "./RoomSelectionItem";
import { DividerStyles } from "./TeacherSearch/styles";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import IconButton from "@mui/material/IconButton";
import { AnimatePresence, motion } from 'framer-motion'

function FavouritePlaces() {
	const navigate = useNavigate();
	const [isFav, setIsFav] = useState<boolean>(true);
	const [mappedItems, setMappedItems] = useState<FavouritePlacesLocalStorage[]>([]);

	const {
		handleRoomSelection,
		setSelectedRoomId,
		selectedFloor,
		setSelectedFloor,
		setSelectedFloorNumber,
		setSelectedBuilding,
		setSelectedFaculty,
	} = useFacultyContext();

	useEffect(() => {
		const items = localStorage.getItem('favoriteRooms');
		if (items) {
			setMappedItems(JSON.parse(items));
		}
	}, []);
	const handleRoomClick = async({
		                              roomName,
		                              roomId,
		                              buildingName,
		                              floorName,
		                              faculty
	                              }: FavouritePlacesLocalStorage) => {
		await handleRoomSelection(roomId);
		setSelectedRoomId(roomId);
		setSelectedFloor(selectedFloor);
		setSelectedFloorNumber(Number(floorName.split(" ")[1]));
		if (buildingName) {
			setSelectedBuilding(buildingName);
			setSelectedFaculty(faculty);
			const normalizedBuildingName = replaceCzechChars(buildingName).replace(/\s/g, "_");
			const normalizedFloorName = replaceCzechChars(floorName).replace(/\s/g, "_");
			navigate(`/map/${ faculty }/${ normalizedBuildingName }/${ normalizedFloorName }/${ roomName }`);
		}
	};

	const removeFavoriteRoom = (roomId: number) => {
		const storageKey = 'favoriteRooms';

		const favoriteRoomsString = localStorage.getItem(storageKey);
		let favoriteRooms: FavouritePlacesLocalStorage[] = favoriteRoomsString? JSON.parse(favoriteRoomsString) : [];

		const index = favoriteRooms.findIndex(room => room.roomId === roomId);

		if (index !== -1) {
			// Room is already a favorite, remove it
			favoriteRooms.splice(index, 1);
			setIsFav(false);
		}
		localStorage.setItem(storageKey, JSON.stringify(favoriteRooms));
		setMappedItems(favoriteRooms);
	};
	useEffect(() => {

	}, [isFav]);

	return (
		<Box display="flex"
		     flexDirection="column"
		     bgcolor="#212121"
		     justifyContent="flex-start"
		     height="100%"
		     width="100%">
			<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
			     pt={ 1 } pb={ 4 } bgcolor="background.paper" color="white">
				<Box width="100%" color="white">
					<AnimatePresence>
						{ mappedItems.length > 0? (
							mappedItems.map((item: FavouritePlacesLocalStorage, index) => (
								<motion.div
									key={ item.roomId }
									layout
									initial={ { opacity: 1, x: 0 } }
									animate={ { opacity: 1 } }
									exit={ { opacity: 0, y: -10 } }
									transition={ { duration: 0.2 } }
								>
									<Box
										display="flex"
										width="100%"
										py={ 1 }
										borderBottom="1px solid white"
										borderTop={ index === 0? "1px solid white" : "none" }
										bgcolor={ "background.paper" }>
										<Box display="flex" justifyContent="space-evenly"
										     alignItems="center"
										     gap={ 2 }
										     pl={ 2 }
										     onClick={ () => handleRoomClick(item) }>
											<Typography variant="h6"
											            sx={ { width: "3.1em" } }>{ item.roomName }</Typography>
											<Divider orientation="vertical"
											         variant="middle"
											         flexItem
											         sx={ DividerStyles } />
											<Typography variant="body1">{ item.floorName }</Typography>
											<Divider orientation="vertical"
											         variant="middle"
											         flexItem
											         sx={ DividerStyles } />
											<Typography variant="body1">{ item.buildingName }</Typography>
											<Divider orientation="vertical"
											         variant="middle"
											         flexItem
											         sx={ DividerStyles } />
											<Typography variant="body1">{ item.faculty }</Typography>
										</Box>

										<IconButton onClick={ () => removeFavoriteRoom(item.roomId) }
										            sx={ { pl: 1, height: "100%", zIndex: "snack-bar", flexGrow: 1 } }>
											<RemoveCircleOutlineIcon color="error" />
										</IconButton>
									</Box>
								</motion.div>
							))
						) : (
							<Paper elevation={ 8 } sx={ { p: 4, width: "60%", margin: "auto" } }>
								<Typography variant="h5" textAlign="center">You don't have any favourite places
									yet!</Typography>
							</Paper>
						) }
					</AnimatePresence>
				</Box>
			</Box>
		</Box>
	);
}

export default FavouritePlaces;
