import React, { useState, useEffect } from "react";
import { useTheme, Typography, Drawer, CircularProgress, Button } from "@mui/material";
import Box from "@mui/material/Box";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import IconButton from "@mui/material/IconButton";
import { FavouritePlacesLocalStorage } from "../RoomSelectionItem";
import { FacultyType } from "../FacultySelection/FacultySelection";
import DrawerListItem from "./DrawerListItem";
import { useAuthContext } from "../../Contexts/AuthContext";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import { RoomDetails } from "../MapComponents/types";
import { mergeStylesWithTheme } from "./styles";
import useAuthToken from "../../hooks/useAuthToken";


interface DrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomData: RoomDetails;
}

export function DesktopDrawer({
	                              isDrawerOpen,
	                              onClose,
	                              roomData
                              }: DrawerComponentProps) {
	const { room_info, floor_info, areal_info, building_info } = roomData;
	const { selectedFaculty, selectedRoomId } = useFacultyContext()
	const { loginMutate } = useAuthToken()
	const faculty = selectedFaculty as FacultyType;
	const [isFav, setIsFav] = useState<boolean>(false);
	const {
		cislo: roomName,
		mistnost_id: roomId,
		popis: description,
		pocet_mist: roomCapacity,
		nazev: roomNameLong,
	} = room_info
	const { cislo: floorNumber, nazev: floorName } = floor_info
	const { zkratka_prezentacni: buildingName, adresa: address } = building_info
	const { nazev_puvodni: arealName } = areal_info
	const [photoUrl, setPhoto] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const theme = useTheme();
	const { loginSuccess, updateLastUsed } = useAuthContext();

	useEffect(() => {
		const getRoomPhoto = async(roomId: number) => {
			let token = sessionStorage.getItem('sessionToken');
			console.log("Token: ", token);
			const headers: HeadersInit = {};
			if (token) {
				headers['Authorization'] = token;
			} else {
				loginMutate();
				token = sessionStorage.getItem('sessionToken');
				if (token) {
					headers['Authorization'] = token;
				} else {
					return "";
				}
			}
			const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/photo/${ roomId }`, {
				method: 'GET',
				headers: headers,
			});

			if (!response.ok) {
				return "";
			}
			if (response.status === 204) {
				return "";
			}
			// Convert the response to a blob if you're working with binary data
			const imageBlob = await response.blob();

			// Create a local URL for the blob to be used in an <img> element
			const imageObjectURL = URL.createObjectURL(imageBlob);
			return imageObjectURL;
		};
		if (loginSuccess && selectedRoomId) {
			updateLastUsed();
			setPhoto("");
			getRoomPhoto(selectedRoomId)
				.then((url: string) => {
					if (url === "") {
						setIsLoading(false);
					}
					setPhoto(url);
					setIsLoading(false);
				})
				.catch((error: Error) => {
					console.error('Failed to load image:', error)
					setIsLoading(false);
				});
		}
	}, [selectedRoomId, loginSuccess]);

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
			<Box display="flex" gap="1%" flexDirection="column" height="100%" position="relative" overflow="auto">
				{ isLoading || photoUrl === ""?
					<Box sx={ {
						display: 'flex',
						color: 'black',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '10px',
						bgcolor: 'grey.300',
						width: '100%', // Subtracts some space for padding
						height: '25em',
						minHeight: "25em",
						maxHeight: 'calc(45em - 2em)',
					} }>{ photoUrl === ""? "No photo yet" : <CircularProgress size={ 90 } /> }
					</Box>
					:
					<Box
						component="img"
						src={ photoUrl }
						alt="Detailed View"
						sx={ {
							borderRadius: '10px',
							width: '100%', // Ensures the image width matches the drawer width minus padding
							height: '25em', // Maintains aspect ratio
							maxHeight: 'calc(45em - 2em)',
							transition: 'max-width 0.3s ease-in-out, max-height 0.3s ease-in-out',
						} }
					/> }
				<Box display="flex" alignItems="center" mt={ 2 }>
					<Typography variant="h3" fontWeight="bolder" sx={ { flexGrow: 1 } }>{ roomName }</Typography>
					<IconButton sx={ { p: 0 } } onClick={ () => toggleFavoriteRoom({
						roomName,
						roomId,
						floorName,
						floorNumber,
						buildingName,
						faculty
					}) }>
						<StarBorderIcon color="primary"
						                style={ {
							                fontSize: "3rem",
							                opacity: isFav? 0 : 1,
							                transition: 'opacity 0.2s',
							                zIndex: 4
						                } } />
						<StarIcon color="primary"
						          style={ {
							          fontSize: "3rem",
							          opacity: isFav? 1 : 0,
							          transition: 'opacity 0.2s',
							          position: 'absolute',
							          zIndex: 4
						          } } />
					</IconButton>
				</Box>
				<Box pb={ 4 }>
					<DrawerListItem text={ roomNameLong } variant="h5" />
				</Box>
				<DrawerListItem text={ roomCapacity } desc="Number of seats:" />
				<DrawerListItem text={ faculty as string } desc="Faculty:" />
				<DrawerListItem text={ buildingName } desc="Building:" />
				<DrawerListItem text={ floorNumber } desc="Floor:" />
				<DrawerListItem text={ arealName } desc="Areal:" />
				<DrawerListItem text={ description } desc="Popis:" />

				<Button sx={ { position: "absolute", bottom: 35, width: "100%", height: 50 } } variant="contained" onClick={ () => {
					window.open(`https://www.google.com/maps/dir/?api=1&destination=${ encodeURIComponent(address) }`, '_blank');
				} }>
					<Typography>Navigate</Typography>
				</Button>
			</Box>
		</Drawer>
	)
}
