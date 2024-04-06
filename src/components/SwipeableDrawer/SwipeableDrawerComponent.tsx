import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React, { useState, useEffect, useRef } from "react";
import { useTheme, Theme, Typography, Button } from "@mui/material";
import Box from "@mui/material/Box";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import IconButton from "@mui/material/IconButton";
import { FavouritePlacesLocalStorage } from "../RoomSelectionItem";
import { FacultyType } from "../FacultySelection/FacultySelection";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { RoomDetails } from "../MapComponents/types";
import { useAuthContext } from "../../Contexts/AuthContext";
import useAuthToken from "../../hooks/useAuthToken";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DrawerListItem from "./DrawerListItem";
import NoPhotographyOutlinedIcon from "@mui/icons-material/NoPhotographyOutlined";
import { Simulate } from "react-dom/test-utils";

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
	const [isImageZoomed, setIsImageZoomed] = useState(false);
	const { selectedFaculty, selectedRoomId } = useFacultyContext()
	const { updateLastUsed, isLoading: authIsLoading, loginSuccess } = useAuthContext()
	const contentRef = useRef<HTMLDivElement | null>(null);
	const imageRef = useRef<HTMLDivElement | null>(null);

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
	const imageHeight = '14em';

	const calculateExpandedHeight = () => {
		const contentHeight = contentRef.current?.offsetHeight || 0;
		const imageHeightFromRef = imageRef.current?.offsetHeight || 0;
		if (imageRef.current && "offsetHeight" in imageRef.current) {
			const totalHeight: string = `${ contentHeight + imageHeightFromRef + 70 }px`;
			return totalHeight;
		} else {
			return "25em"
		}
	};


	useEffect(() => {
		const getRoomPhoto = async(roomId: number) => {
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
			const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/photo/${ roomId }`, {
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

	const toggleDrawerHeight = () => {
		const newHeight = drawerHeight === '14em'? calculateExpandedHeight() : '14em';
		setDrawerHeight(newHeight);
	};
	useEffect(() => {
		if (!isDrawerOpen) {
			setDrawerHeight('14em');
		}
	}, [isDrawerOpen]);

	const handleCloseDrawer = () => {
		setDrawerHeight('14em');
		onClose();
	};

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
				`${ transitions.create(['height', 'transform'], {
					duration: transitions.duration.leavingScreen,
					easing: transitions.easing.sharp,
				}) } !important`,
		},
	};

	return (
		<SwipeableDrawer
			anchor="bottom"
			open={ isDrawerOpen }
			onClose={ handleCloseDrawer }
			onOpen={ onOpen }
			transitionDuration={ { enter: 500, exit: 200 } }
			sx={ drawerStyles }
		>
			<Box display="flex"
			     position="absolute"
			     sx={ { top: { xs: "1.2em", sm: "2em" } } }
			     left={ 0 }
			     width="100%"
			     gap={ 8 }
			     height="fit-content"
			     alignItems="center"
			     justifyContent="space-around"
			>
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
				<Box height="fit-content">
					<Typography variant="h4" fontWeight="bolder">{ room_info.cislo }</Typography>
				</Box>
				<IconButton onClick={ toggleDrawerHeight }
				            sx={ {
					            display: "flex",
					            flexDirection: "column",
					            p: "0.1em",
					            bgcolor: "#181f25 !important",
					            borderRadius: "10px",
					            zIndex: 400,
				            } }
				>
					{ drawerHeight === '14em'?
						<ExpandLessIcon color="info" sx={ { fontSize: "3rem", transition: 'opacity 0.2s' } } /> :
						<ExpandMoreIcon color="info" sx={ { fontSize: "3rem", transition: 'opacity 0.2s' } } />
					}
				</IconButton>
			</Box>

			<Box position="absolute"
			     top="1em"
			     left="25%"
			     borderTop="5px solid #ABABAB"
			     height="1px"
			     width="50%"
			     display="flex"
			/>
			<Box display="flex"
			     ref={ contentRef }
			     minHeight="fit-content"
			     gap="0.3em"
			     width="95%"
			     flexDirection="column"
			     minWidth="fit-content"
			     position="relative"
			     overflow="hidden"
			     sx={ { mt: { xs: "3em", sm: "4em" } } }>
				<DrawerListItem text={ room_info.nazev } desc="Room name:" />
				<DrawerListItem text={ room_info.pocet_mist } desc="Number of seats:" />
				<DrawerListItem text={ faculty as string } desc="Faculty:" />
				<DrawerListItem text={ buildingName } desc="Building:" />
				<DrawerListItem text={ floorNumber } desc="Floor:" />
				<DrawerListItem text={ arealName } variant="body1" desc="Areal:" />
			</Box>
			<Box zIndex="-1"
			     width="90%"
			     ref={ imageRef }
			     position="absolute"
			     sx={ { bottom: drawerHeight === "14em"? "0em" : "3em", transition: "all 0.15s ease" } }>
				{ isLoading || isError? <Box sx={ {
						display: "flex",
						color: 'black',
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: '10px',
						bgcolor: 'grey.700',
						maxWidth: '100%',
						height: imageHeight,
						maxHeight: '45dvh',
						cursor: 'pointer',
						overflow: 'hidden',
						opacity: drawerHeight === "14em"? 0 : 1,
						transition: 'opacity 0.3s',
					} }>{ isError?
						<Box display="flex"
						     sx={ { opacity: drawerHeight === "14em"? 0 : 1, } }
						     flexDirection="column"
						     alignItems="center">
							<NoPhotographyOutlinedIcon />
							<Typography>No photo yet!</Typography>
						</Box> : "Loading.." }</Box> :
					<Box
						display="flex"
						component="img"
						src={ photoUrl }
						alt="Detailed View"
						sx={ {
							opacity: drawerHeight === "14em"? 0 : 1,
							transition: 'opacity 0.3s',
							borderRadius: '10px',
							width: '100%',
							maxWidth: '100%',
							height: imageHeight,
							maxHeight: '45dvh',
							cursor: 'pointer',
						} }
						onClick={ handleImageClick }
					/>
				}
			</Box>

			<Button sx={ { position: "absolute", bottom: 0, width: "90%", height: { xs: 40, sm: 50, lg: 100 } } }
			        variant="contained"
			        onClick={ () => {
				        window.open(`https://www.google.com/maps/dir/?api=1&destination=${ encodeURIComponent(building_info.adresa) }`, '_blank');
			        } }>
				<Typography>Navigate</Typography>
			</Button>
		</SwipeableDrawer>
	)
}
