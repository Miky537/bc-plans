import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { fetchFacultyRooms } from "../MapComponents/tempFile";
import Fuse from "fuse.js";
import { useFacultyContext } from "../FacultyContext";
import { Typography, Divider } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import PlaceIcon from '@mui/icons-material/Place';
import { FacultyType } from "../FacultySelection/FacultySelection";

interface RoomNames {
	nazev: string;
	room_id: number;
	floor_number: number;
	faculty: FacultyType;
}

interface SearchComponentProps {
	setSelectedRoom: (roomId: number) => void;
	setSelectedFloor: (floor: number) => void;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

export function SearchComponent({ setSelectedRoom, setSelectedFloor, setIsDrawerOpen }: SearchComponentProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [rooms, setRooms] = useState<RoomNames[]>([]);
	const [query, setQuery] = useState("");
	const [filteredRooms, setFilteredRooms] = useState<RoomNames[]>([]);
	const {
		handleRoomSelection,
		selectedFaculty,
		setSelectedFaculty,
		setFacultyChangeSource,
	} = useFacultyContext();
	const [previouslySearchedRooms, setPreviouslySearchedRooms] = useState<RoomNames[]>([]);
	const [isWriting, setIsWriting] = useState(false);

	useEffect(() => {
		const fetchRooms = async() => {
			const fetchedRooms = await fetchFacultyRooms(selectedFaculty);
			if (Array.isArray(fetchedRooms)) {

				setRooms(fetchedRooms);
				// console.log(fetchedRooms);
			} else {
				setRooms([]);
			}
		};
		fetchRooms();
	}, [selectedFaculty]);

	useEffect(() => {
		const options = {
			includeScore: true,
			keys: ["nazev"], // Assuming the rooms have a 'name' property to search against
		};
		const fuse = new Fuse(rooms, options);
		const result = query? fuse.search(query).map(result => result.item) : [];
		setFilteredRooms(result.slice(0, 5)); // Take the top 4 results
	}, [query, rooms]);

	const handleExpand = () => {
		setIsExpanded(true);
		setIsWriting(false);
		const storedRooms = localStorage.getItem('previouslySearched');
		if (storedRooms) {
			setPreviouslySearchedRooms(JSON.parse(storedRooms));
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

	const handleRoomSearchClick = (room: RoomNames, event: any) => {
		event.stopPropagation();
		setFacultyChangeSource('search');
		// Step 1: Retrieve existing data from local storage
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
		setSelectedFaculty(room.faculty);
	}

	return (
		<Box
			sx={ {
				width: isExpanded? "95%" : "3em",
				height: "3em",
				bgcolor: "black",
				borderRadius: isExpanded? "10px" : "50%",
				borderBottomLeftRadius: isExpanded? "0" : "50%",
				borderBottomRightRadius: isExpanded? "0" : "50%",
				transition: "all 0.3s ease",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "absolute",
				top: "4em",
				left: "0.5em",
				zIndex: 3,
			} }
			onClick={ handleExpand }
		>
			{ isExpanded? (
				<>
					<InputBase
						autoFocus
						placeholder="Type to find room.."
						inputProps={ { "aria-label": "search" } }
						onBlur={ handleCollapse }
						onChange={ handleSearch }
						sx={ {
							color: "white",
							width: "100%",
							'.MuiInputBase-input': {
								padding: "10px 0",
								pl: "1em",
							},
						} }
					/>
					{ isWriting? <Box sx={ {
						position: "absolute",
						top: "100%",
						color: "white",
						transition: "max-height 1s ease-out", // Transition for the roll-down effect
						overflow: "hidden",
						maxHeight: isExpanded? "300px" : "0", // Adjust max-height accordingly
						width: "100%",
						borderBottomLeftRadius: 10,
						borderBottomRightRadius: 10,
						bgcolor: "background.paper"
					} }>
						{ filteredRooms.map((room, index) => (
							<React.Fragment key={ index }>
								<Box display="flex"
								     alignItems="center"
								     sx={ { padding: "10px" } }
								     color="white"
								     gap={ 1 }
								     flexDirection="row"
								     onClick={ (event) => handleRoomSearchClick(room, event) }>
									<PlaceIcon color="info" />
									<Typography>{ room.nazev } - Podlaží: { room.floor_number } -
										Fakulta: { room.faculty }</Typography>
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
					</Box> : <Box sx={ {
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
								<Box display="flex"
								     overflow="hidden"
								     alignItems="center"
								     sx={ { padding: "10px" } }
								     color="white"
								     gap={ 1 }
								     flexDirection="row"
								     onClick={ (event) => handleRoomSearchClick(room, event) }>
									<HistoryIcon color="info" />
									<Typography overflow="hidden" whiteSpace="nowrap">
										{ room.nazev } - Podlaží: { room.floor_number } - Fakulta: { room.faculty }
									</Typography>
								</Box>
								<Divider flexItem
								         variant="middle"
								         color="#FFFFF"
								         sx={ {
									         backgroundColor: "gray",
									         display: index === previouslySearchedRooms.length - 1? "none" : "block"
								         } } />
							</React.Fragment>
						)) }
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
