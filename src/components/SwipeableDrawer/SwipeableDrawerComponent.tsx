import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React, { useState, useEffect } from "react";
import { useTheme, SxProps, Theme, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { RoomDetails } from "../MapComponents/tempFile";
import { getRoomPhoto } from "../TeacherSearch/apiCalls";
import { useFacultyContext } from "../FacultyContext";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavouritePlacesLocalStorage } from "../RoomSelectionItem";
import { FacultyType } from "../FacultySelection/FacultySelection";


interface SwipeableDrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomData: RoomDetails;
}

const mergeStylesWithTheme = (theme: Theme): SxProps => {
	return {
		"& .MuiDrawer-paper.MuiDrawer-paperAnchorBottom": {
			height: "30%",
			borderRadius: "40px 40px 0px 0px",
			padding: "2em 1em 1em 1em",
			backgroundColor: theme.palette.background.default,
		},
	};
};


export function SwipeableDrawerComponent({
	                                         isDrawerOpen,
	                                         onClose,
	                                         onOpen,
	                                         roomData
                                         }: SwipeableDrawerComponentProps) {
	const { room_info, floor_info, areal_info, building_info } = roomData;
	const [isImageZoomed, setIsImageZoomed] = useState(false);
	const { selectedFaculty, selectedRoomId } = useFacultyContext()
	const faculty = selectedFaculty as FacultyType;
	const [isFav, setIsFav] = useState<boolean>(false);
	const { cislo: roomName, mistnost_id: roomId, mistnost_typ_id: roomType, label: roomLabel } = room_info
	const { podlazi_id: floorId, cislo: floorNumber, nazev: floorName } = floor_info
	const { zkratka_prezentacni: buildingName } = building_info
	const { nazev_puvodni: arealName} = areal_info
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

	const handleImageClick = () => {
		setIsImageZoomed(!isImageZoomed);
	};
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
		<SwipeableDrawer
			anchor="bottom"
			open={ isDrawerOpen }
			onClose={ onClose }
			onOpen={ onOpen }
			transitionDuration={ { enter: 500, exit: 200 } }
			sx={ mergeStylesWithTheme(theme) }
		>
			<Box position="absolute"
			     top="1em"
			     left="25%"
			     borderTop="5px solid #ABABAB"
			     height="1px"
			     width="50%"
			     display="flex"></Box>
			<Box display="flex" gap={ 2 }>
				{ isLoading || isError? <Box sx={ {
					display: 'flex',
					color: 'black',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '10px',
					bgcolor: 'grey.300',
					width: '55%',
					maxWidth: '55%',
					height: '100%',
					maxHeight: '45dvh',
					cursor: 'pointer',
				} }>{ isError? "No photo yet" : "Loading.." }</Box> : <Box
					component="img"
					src={ photoUrl }
					alt="Detailed View"
					sx={ {
						borderRadius: '10px',
						maxWidth: isImageZoomed? '100%' : '55%',
						maxHeight: isImageZoomed? '90dvh' : '45dvh',
						cursor: 'pointer',
						transition: 'max-width 0.3s ease-in-out, max-height 0.3s ease-in-out',
					} }
					onClick={ handleImageClick }
				/> }
				<IconButton onClick={ () => toggleFavoriteRoom({
					roomName,
					roomId,
					floorName,
					floorNumber,
					buildingName,
					faculty
				}) } sx={ { position: "absolute", top: 0, right: 0 } }>
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
				<Box sx={ {
					opacity: isImageZoomed? 0 : 1,
					display: isImageZoomed? 'none' : 'block',
					cursor: 'pointer',
					transition: 'opacity 0.05s ease-in-out, display 0.05s ease-in-out',
				} }>

					<Typography variant="h6">Room: { room_info.cislo }</Typography>
					<Typography variant="h6">Floor: { floor_info.cislo }</Typography>
					<Typography variant="h6">Building: { building_info.zkratka_prezentacni }</Typography>
				</Box>
			</Box>


			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">name:</Typography><Typography variant="h6">{ roomName }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">popis:</Typography><Typography variant="h6">{ room_info.popis }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">podlazi_id:</Typography><Typography variant="h6">{ floorId }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">label:</Typography><Typography variant="h6">{ roomLabel }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">Areal
				name:</Typography><Typography variant="h6">{ arealName }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">Room
				Id:</Typography><Typography variant="h6">{ roomId }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">roomType</Typography><Typography variant="h6">{ roomType }</Typography></Box>
		</SwipeableDrawer>
	)
}
