import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { fetchFacultyRooms } from "../MapComponents/apiCalls";
import Fuse from "fuse.js";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import { Typography, Divider } from "@mui/material";
import PlaceIcon from '@mui/icons-material/Place';
import { FacultyType } from "../Selections/FacultySelection/FacultySelection";
import { FavouritePlacesLocalStorage } from "../Selections/FloorSelection/RoomSelectionItem";
import { InputBaseStyle, searchBoxStyle, SearchBoxContainer } from "./styles";
import SearchedItem from "./SearchedItem";
import FavItem from "./FavItem";


export interface RoomNames {
	room_id: number;
	room_name: string | null;
	floor_number: number;
	faculty: FacultyType;
	building_name: string;
}

interface SearchComponentProps {
	setSelectedRoom: (roomId: number) => void;
	setSelectedFloor: (floor: number) => void;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
	setAreFeaturesLoading: (areFeaturesLoading: boolean) => void;
}

export function SearchComponent({
	                                setSelectedRoom,
	                                setSelectedFloor,
	                                setIsDrawerOpen,
	                                setAreFeaturesLoading
                                }: SearchComponentProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [searchRooms, setSearchRooms] = useState<RoomNames[]>([]);
	const [favouriteRooms, setFavouriteRooms] = useState<FavouritePlacesLocalStorage[]>([]);
	const [query, setQuery] = useState("");
	const [filteredRooms, setFilteredRooms] = useState<RoomNames[]>([]);
	const {
		handleRoomSelection,
		setFacultyChangeSource,
		selectedFaculty
	} = useFacultyContext();
	const [previouslySearchedRooms, setPreviouslySearchedRooms] = useState<RoomNames[]>([]);
	const [isWriting, setIsWriting] = useState(false);

	useEffect(() => {
		const fetchRooms = async() => {
			const fetchedRooms = await fetchFacultyRooms();
			if (Array.isArray(fetchedRooms)) {
				sessionStorage.setItem("allRooms", JSON.stringify(fetchedRooms));
				setSearchRooms(fetchedRooms);
			} else {
				setSearchRooms([]);
			}
		};
		if (sessionStorage.getItem("allRooms") === null)
			fetchRooms();
		else setSearchRooms(JSON.parse(sessionStorage.getItem("allRooms") as string));
	}, []);

	useEffect(() => {
		const options = {
			includeScore: true,
			keys: ["room_name"], // Assuming the rooms have a 'name' property to search against
		};
		const fuse = new Fuse(searchRooms, options);
		const result = query? fuse.search(query).map(result => {

			return result.item
		}) : [];
		setFilteredRooms(result.slice(0, 9)); // Take the top 5 results
	}, [query, searchRooms]);

	const handleExpand = () => {
		setIsExpanded(true);
		setIsWriting(false);
		const storedRooms = localStorage.getItem('previouslySearched');
		const favouriteRooms = localStorage.getItem('favoriteRooms');
		if (storedRooms) {
			setPreviouslySearchedRooms(JSON.parse(storedRooms));
		}
		if (favouriteRooms) {
			setFavouriteRooms(JSON.parse(favouriteRooms));
		}
	};

	const handleCollapse = () => {
		setTimeout(() => {
			setIsExpanded(false)
			setIsWriting(false);
		}, 200);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.value;
		setIsWriting(newValue === ""? false : true);
		setQuery(newValue);
	};

	useEffect(() => {
		const fetchPreviouslySearched = () => {
			const storedRooms = localStorage.getItem('previouslySearched');
			if (storedRooms) {
				setPreviouslySearchedRooms(JSON.parse(storedRooms));
			}
		};
		fetchPreviouslySearched();
	}, []);

	const handleRoomSearchClick = (room: RoomNames, event: React.MouseEvent) => {
		event.stopPropagation();
		if (room.faculty !== selectedFaculty) {
			setAreFeaturesLoading(true);
		}
		setFacultyChangeSource('search');
		// Retrieve existing data from local storage
		const previouslySearched = localStorage.getItem('previouslySearched');
		const previouslySearchedRooms = previouslySearched? JSON.parse(previouslySearched) : [];

		// Check if the room is already in the array to avoid duplicates
		const existingIndex = previouslySearchedRooms.findIndex((existingRoom: RoomNames) => existingRoom.room_id === room.room_id);

		let updatedRooms = [];

		if (existingIndex !== -1) {
			// If the room is already included, move it to the end to mark it as the most recent
			updatedRooms = [
				...previouslySearchedRooms.slice(0, existingIndex),
				...previouslySearchedRooms.slice(existingIndex + 1),
				room,
			];
		} else {
			// If the room is not included, add it
			updatedRooms = [...previouslySearchedRooms, room];
		}
		// Ensure only the last 3 items are kept
		if (updatedRooms.length > 3) {
			updatedRooms = updatedRooms.slice(-3);
		}
		// Save the updated array back to local storage
		localStorage.setItem('previouslySearched', JSON.stringify(updatedRooms));
		setIsWriting(false);
		setSelectedRoom(room.room_id);
		setSelectedFloor(room.floor_number);
		handleRoomSelection(room.room_id);
		setIsExpanded(false);
		setIsDrawerOpen(true);
	}

	const handleFavouriteRoomClick = (room: FavouritePlacesLocalStorage, event: any) => {
		if (room.faculty !== selectedFaculty) {
			setAreFeaturesLoading(true);
		}
		event.stopPropagation();
		setFacultyChangeSource('search');
		setIsWriting(false);
		setSelectedRoom(room.roomId);
		setSelectedFloor(room.floorNumber);
		handleRoomSelection(room.roomId);
		setIsExpanded(false);
		setIsDrawerOpen(true);
	}


	return (
		<Box
			sx={ SearchBoxContainer(isExpanded) }
			onClick={ handleExpand }
			zIndex={ 1100 }
		>
			{ isExpanded? (
				<>
					<InputBase
						autoFocus
						placeholder="Název místnosti.."
						inputProps={ { "aria-label": "search" } }
						onBlur={ handleCollapse }
						onChange={ handleSearch }
						sx={ InputBaseStyle }
					/>
					{ isWriting? <Box sx={ {
							position: "absolute",
							top: "100%",
							color: "white",
							transition: "max-height 1s ease-out",
							overflow: "auto",
							maxHeight: isExpanded? "50vh" : "0",
							width: "100%",
							borderBottomLeftRadius: 10,
							borderBottomRightRadius: 10,
							bgcolor: "background.paper"
						} }>
							{ filteredRooms.map((room, index) => (
								<React.Fragment key={ index }>
									<Box sx={ searchBoxStyle }
									     onClick={ (event) => handleRoomSearchClick(room, event) }>
										<PlaceIcon color="info" />
										<Typography sx={{display: "flex", alignItems: "center"}}>
											<Typography variant="body1">{room.room_name}&nbsp;-&nbsp;</Typography>
											<Typography variant="body2"> podlaží {room.floor_number}&nbsp;-&nbsp;</Typography>
											<Typography variant="body2"> {room.building_name}&nbsp;-&nbsp;</Typography>
											<Typography variant="body2"> {room.faculty}</Typography>
										</Typography>
									</Box>
									<Divider flexItem
									         variant="middle"
									         color="#FFFFF"
									         sx={ {
										         backgroundColor: "gray",
										         display: index === filteredRooms.length - 1? "none" : "block"
									         } } />
								</React.Fragment>
							)) }
						</Box>
						:
						<Box sx={ {
							position: "absolute",
							top: "100%",
							width: "100%",
							bgcolor: "background.paper",
							color: "black",
							borderBottomLeftRadius: 10,
							borderBottomRightRadius: 10
						} }>

							{ previouslySearchedRooms.slice().reverse().map((room, index) => (
								<React.Fragment key={ index }>
									<SearchedItem room={ room } handleRoomSearchClick={ handleRoomSearchClick } />
									<Divider flexItem
									         variant="middle"
									         color="#FFFFF"
									         sx={ {
										         backgroundColor: "gray",
										         display: index === previouslySearchedRooms.length - 1 && favouriteRooms.length === 0? "none" : "block"
									         } } />
								</React.Fragment>
							)) }
							<Box maxHeight="60dvh" overflow="auto">{
								favouriteRooms.map((roomObject, index) => (
										<React.Fragment key={ index }>
											<Divider flexItem
											         variant="middle"
											         color="#FFFFF"
											         sx={ {
												         backgroundColor: "gray",
												         display: index === 0? "block" : "none"
											         } } />
											<FavItem room={ roomObject }
											         handleFavouriteRoomClick={ handleFavouriteRoomClick } />
											<Divider flexItem
											         variant="middle"
											         color="#FFFFF"
											         sx={ {
												         backgroundColor: "gray",
												         display: index === favouriteRooms.length - 1? "none" : "block"
											         } } />
										</React.Fragment>
									)
								) }</Box>
						</Box> }
				</>
			) : (
				<IconButton sx={ { color: "white", padding: 0 } }>
					<SearchIcon fontSize="large" />
				</IconButton>
			) }
		</Box>
	);
}
