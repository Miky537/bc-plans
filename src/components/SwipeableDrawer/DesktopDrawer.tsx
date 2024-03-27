import React, { useState, useEffect } from "react";
import { useTheme, SxProps, Theme, Typography, Drawer } from "@mui/material";
import Box from "@mui/material/Box";
import { RoomDetails } from "../MapComponents/tempFile";
import { getRoomPhoto } from "../TeacherSearch/apiCalls";
import { useFacultyContext } from "../FacultyContext";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavouritePlacesLocalStorage } from "../RoomSelectionItem";
import { FacultyType } from "../FacultySelection/FacultySelection";
import DrawerListItem from "./DrawerListItem";


interface DrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomData: RoomDetails;
}

const mergeStylesWithTheme = (theme: Theme): SxProps => {
	return {
		"& .MuiDrawer-paper.MuiDrawer-paperAnchorLeft": {
			maxWidth: "25em",
			width: "25em",
			borderRadius: "0px 4% 40px 0px",
			padding: "2em 1em 1em 1em",
			backgroundColor: theme.palette.background.default,
		},
	};
};

const boxStyles = {
	borderRadius: '20px',
	cursor: 'pointer',
	transition: 'max-width 0.3s ease-in-out, max-height 0.3s ease-in-out',
	width: '100%', // Ensures the width matches between placeholders and images
	maxHeight: '40vh', // Consistent maximum height
	height: 'auto', // Allows natural height but within the maxHeight constraint
	objectFit: 'contain', // For images, to ensure they fit within the box without stretching/distorting
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden', // Prevents content from spilling outside the box
};


export function DesktopDrawer({
	                              isDrawerOpen,
	                              onClose,
	                              onOpen,
	                              roomData
                              }: DrawerComponentProps) {
	const { room_info, floor_info, areal_info, building_info } = roomData;
	const { selectedFaculty, selectedRoomId } = useFacultyContext()
	const faculty = selectedFaculty as FacultyType;
	const [isFav, setIsFav] = useState<boolean>(false);
	const {
		cislo: roomName,
		mistnost_id: roomId,
		mistnost_typ_id: roomType,
		label: roomLabel,
		popis: description
	} = room_info
	const { podlazi_id: floorId, cislo: floorNumber, nazev: floorName } = floor_info
	const { zkratka_prezentacni: buildingName, adresa: address } = building_info
	const { nazev_puvodni: arealName } = areal_info
	const [photoUrl, setPhoto] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const theme = useTheme();

	useEffect(() => {
		setIsError(false);
		setIsLoading(true);
		setPhoto("");
		if (!selectedRoomId) {
			return;
		}
		getRoomPhoto(selectedRoomId)
			.then((url: any) => {
				if (url === "") {
					setIsError(true);
					setIsLoading(false);
				}
				setPhoto(url);
				setIsLoading(false);
			})
			.catch((error: any) => {
				console.error('Failed to load image:', error)
				setIsError(true);
				setIsLoading(false);
			});
	}, [selectedRoomId]);

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
	useEffect(() => {
		setIsFav(false);
		const storageKey = 'favoriteRooms';
		const favoriteRoomsString = localStorage.getItem(storageKey);
		const favoriteRooms: FavouritePlacesLocalStorage[] = favoriteRoomsString? JSON.parse(favoriteRoomsString) : [];
		const isFavorite = favoriteRooms.some(room => room.roomId === roomId);
		setIsFav(isFavorite);
	}, [roomId, isDrawerOpen]);

	return (
		<Drawer
			anchor="left"
			open={ isDrawerOpen }
			onClose={ onClose }
			transitionDuration={ { enter: 750, exit: 200 } }
			sx={ mergeStylesWithTheme(theme) }
		>
			<Box display="flex" gap={ 1 } flexDirection="column">
				{ isLoading || isError? <Box sx={ {
						...boxStyles,
						bgcolor: 'grey.700', // Placeholder specific styles
					} }>{ isError?
						<Box display="flex"
						     justifyContent="center"
						     alignItems="center"
						     height="36vh"
						     width="25em"
						     borderRadius="20px">
							<Typography variant="h4">No photo yet</Typography>
						</Box>
						:
						<Box display="flex"
						     justifyContent="center"
						     alignItems="center"
						     height="36vh"
						     width="25em"
						     borderRadius="20px">
							<Typography variant="h4">Loading...</Typography>
						</Box>
					}</Box>
					:
					<Box
						maxHeight="36vh"
						overflow="auto" // Enables scrolling within this box
						width="100%"
					>
						<Box height="36vh" width="25em">
							<Box
								component="img"
								src={ photoUrl }
								alt="Detailed View"
								height="99%"
								width="100%"
								borderRadius="20px"
							/>
						</Box>
					</Box>
				}
				<Box display="flex" alignItems="center" mt={ 2 }>
					<Typography variant="h3" sx={ { flexGrow: 1 } }>{ roomName }</Typography>
					<IconButton sx={ { p: 0 } } onClick={ () => toggleFavoriteRoom({
						roomName,
						roomId,
						floorName,
						floorNumber,
						buildingName,
						faculty
					}) }>
						<FavoriteBorderIcon color="error"
						                    style={ {
							                    fontSize: "3rem",
							                    opacity: isFav? 0 : 1,
							                    transition: 'opacity 0.2s',
							                    zIndex: 4
						                    } } />
						<FavoriteIcon color="error"
						              style={ {
							              fontSize: "3rem",
							              opacity: isFav? 1 : 0,
							              transition: 'opacity 0.2s',
							              position: 'absolute',
							              zIndex: 4
						              } } />
					</IconButton>
				</Box>
				<DrawerListItem text={ faculty as string } />
				<DrawerListItem text={ buildingName } />
				<DrawerListItem text={ floorName } />
				<DrawerListItem text={ arealName } />
				<DrawerListItem text={ address } />
				<DrawerListItem text={ description } desc="Popis:" />
			</Box>


		</Drawer>
	)
}
