import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React, { useState, useEffect, useRef } from "react";
import { useTheme, Theme, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import { FavouritePlacesLocalStorage } from "../Selections/FloorSelection/RoomSelectionItem";
import { FacultyType } from "../Selections/FacultySelection/FacultySelection";
import { RoomDetails } from "../MapComponents/types";
import { useAuthContext } from "../../Contexts/AuthContext";
import useAuthToken from "../../hooks/useAuthToken";
import DrawerListItem from "./DrawerListItem";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import { MoveButton } from "./MoveButton";
import { FavIconButton } from "./FavIconButton";
import NavigateButton from "./NavigateButton";

interface SwipeableDrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomData: RoomDetails;
}

export function SwipeableDrawerComponent({
	                                         isDrawerOpen,
	                                         onClose,
	                                         onOpen,
	                                         roomData
                                         }: SwipeableDrawerComponentProps) {
	const { room_info, floor_info, areal_info, building_info } = roomData;
	const { selectedFaculty, selectedRoomId } = useFacultyContext()
	const { updateLastUsed, isLoading: authIsLoading, loginSuccess } = useAuthContext()
	const contentRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLImageElement | null>(null);

	const { loginMutate } = useAuthToken()
	const faculty = selectedFaculty as FacultyType;
	const [isFav, setIsFav] = useState<boolean>(false);
	const { cislo: roomName, mistnost_id: roomId, mistnost_typ_id: roomType, label: roomLabel } = room_info
	const { podlazi_id: floorId, cislo: floorNumber, nazev: floorName } = floor_info
	const { zkratka_prezentacni: buildingName } = building_info
	const { nazev_puvodni: arealName } = areal_info
	const [photoUrl, setPhoto] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const theme = useTheme();
	const [drawerHeight, setDrawerHeight] = useState('14em');
	const [expanded, setExpanded] = useState(false);

	const calculateExpandedHeight = () => {
		const contentHeight = contentRef.current?.offsetHeight || 0;
		const imageHeightFromRef = imageRef.current?.offsetHeight || 0;
		const totalHeight: string = `${contentHeight + imageHeightFromRef + 70}px`;
		return totalHeight;
	};

	const getRoomPhoto = async (roomId: number) => {
		setIsError(false);
		setIsLoading(true);
		let token = sessionStorage.getItem('sessionToken');
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
		const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/photo/${roomId}`, {
			method: 'GET',
			headers: headers,
		});

		if (!response.ok) {
			loginMutate();
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

	useEffect(() => {
		if (loginSuccess && selectedRoomId) {
			updateLastUsed();
			setPhoto("");
			if (!selectedRoomId) {
				return;
			}
			getRoomPhoto(selectedRoomId)
				.then((url: string) => {
					if (url === "") {
						setIsError(true);
						setIsLoading(false);
					}
					setPhoto(url);
					setIsLoading(false);
				})
				.catch((error: Error) => {
					console.error('Failed to load image:', error)
					setIsError(true);
					setIsLoading(false);
				});
		}

	}, [selectedRoomId, loginSuccess]);

	const handleImageLoad = () => {
		if (expanded) {
			setDrawerHeight(calculateExpandedHeight());
		}
	};

	const toggleDrawerHeight = () => {
		const newHeight = drawerHeight === '14em' ? calculateExpandedHeight() : '14em';
		setDrawerHeight(newHeight);
		setExpanded(!expanded);
	};

	useEffect(() => {
		if (!isDrawerOpen) {
			setDrawerHeight('14em');
			setExpanded(false);
		}
	}, [isDrawerOpen]);

	const handleCloseDrawer = () => {
		setDrawerHeight('14em');
		setExpanded(false);
		onClose();
	};

	const toggleFavoriteRoom = (roomToToggle: FavouritePlacesLocalStorage) => {
		const storageKey = 'favoriteRooms';

		const favoriteRoomsString = localStorage.getItem(storageKey);
		let favoriteRooms: FavouritePlacesLocalStorage[] = favoriteRoomsString ? JSON.parse(favoriteRoomsString) : [];

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
		const favoriteRooms: FavouritePlacesLocalStorage[] = favoriteRoomsString ? JSON.parse(favoriteRoomsString) : [];
		const isFavorite = favoriteRooms.some(room => room.roomId === roomId);
		setIsFav(isFavorite);
	}, [roomId, isDrawerOpen]);

	const drawerStyles = {
		'& .MuiDrawer-paperAnchorBottom.MuiPaper-root.MuiDrawer-paper': {
			height: drawerHeight,
			minHeight: 'fit-content',
			overflow: 'visible',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			borderRadius: '20px 20px 0 0',
			padding: '2em 1em',
			pb: { xs: "3em", sm: "6.5em" },
			backgroundColor: theme.palette.background.default,
			transition: ({ transitions }: Theme) =>
				`${transitions.create(['height', 'transform'], {
					duration: transitions.duration.leavingScreen,
					easing: transitions.easing.sharp,
				})} !important`,
		},
	};

	return (
		<SwipeableDrawer
			anchor="bottom"
			open={isDrawerOpen}
			onClose={handleCloseDrawer}
			onOpen={onOpen}
			transitionDuration={{ enter: 750, exit: 200 }}
			sx={drawerStyles}
		>
			<Box display="flex"
			     position="absolute"
			     sx={{ top: { xs: "1.2em", sm: "2em" } }}
			     left={0}
			     width="100%"
			     gap={8}
			     height="fit-content"
			     alignItems="center"
			     justifyContent="space-around"
			>
				<FavIconButton toggleFavoriteRoom={toggleFavoriteRoom}
				               isFav={isFav}
				               roomName={roomName}
				               roomId={roomId}
				               floorName={floorName}
				               floorNumber={floorNumber}
				               buildingName={buildingName}
				               faculty={faculty} />
				<Box height="fit-content">
					<Typography variant="h4" fontWeight="bolder">{room_info.cislo}</Typography>
				</Box>
				<MoveButton toggleDrawerHeight={toggleDrawerHeight} drawerHeight={drawerHeight} />
			</Box>
			<Box display="flex"
			     ref={contentRef}
			     minHeight="fit-content"
			     gap="0.3em"
			     width="95%"
			     flexDirection="column"
			     minWidth="fit-content"
			     position="relative"
			     overflow="hidden"
			     sx={{ mt: { xs: "3em", sm: "4em" } }}>
				<DrawerListItem text={room_info.nazev} desc="Název místnosti:" />
				<DrawerListItem text={room_info.pocet_mist} desc="Počet míst na sezení:" />
				<DrawerListItem text={faculty as string} desc="Fakulta:" />
				<DrawerListItem text={buildingName} desc="Budova:" />
				<DrawerListItem text={floorNumber} desc="Podlaží:" />
				<DrawerListItem text={arealName} variant="body1" desc="Areál:" />
			</Box>
			<Box zIndex="-1"
			     width="90%"
			     ref={imageRef}
			     position="absolute"
			     sx={{ bottom: drawerHeight === "14em" ? "0em" : "3em", transition: "all 0.15s ease" }}>
				{isLoading || isError ? <Box sx={{
						display: "flex",
						color: 'black',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '10px',
						bgcolor: 'grey.700',
						maxWidth: '100%',
						height: "14em",
						maxHeight: '45dvh',
						cursor: 'pointer',
						overflow: 'hidden',
						opacity: drawerHeight === "14em" ? 0 : 1,
						transition: 'opacity 0.3s',
					}}>{isError ?
						<Box display="flex"
						     sx={{ opacity: drawerHeight === "14em" ? 0 : 1, }}
						     flexDirection="column"
						     alignItems="center">
							<NoPhotographyOutlinedIcon />
							<Typography>Zatím žádná fotka!</Typography>
						</Box> : "Načítání.."}</Box>
					:
					<Box height="fit-content"
					     maxHeight="20em"
					     width="100%"
					     overflow={drawerHeight === "14em" ? "hidden" : "auto"}>
						<Box
							display="flex"
							component="img"
							className="PhotoBox"
							src={photoUrl}
							alt="Detailed View"
							onLoad={handleImageLoad}
							sx={{
								opacity: drawerHeight === "14em" ? 0 : 1,
								transition: 'opacity 0.3s',
								borderRadius: '10px',
								width: '100%',
								maxWidth: '100%',
								objectFit: 'cover',
								zIndex: 1,
								cursor: 'pointer',
							}}
						/>
					</Box>
				}
			</Box>
			<NavigateButton address={building_info.adresa} />
		</SwipeableDrawer>
	)
}
