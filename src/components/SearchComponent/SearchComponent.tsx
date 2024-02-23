import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import { fetchFacultyRooms } from "../MapComponents/tempFile";
import Fuse from "fuse.js";

interface RoomNames {
	nazev: string;
	room_id: number;
	floor_number: number;
}

interface SearchComponentProps {
	setSelectedRoom: (roomId: number) => void;
	setSelectedFloor: (floor: number) => void;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
	handleRoomSelection: (roomId: number) => void;
}

export function SearchComponent({ setSelectedRoom, setSelectedFloor, setIsDrawerOpen, handleRoomSelection }: SearchComponentProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [rooms, setRooms] = useState<RoomNames[]>([]);
	const [query, setQuery] = useState("");
	const [filteredRooms, setFilteredRooms] = useState<RoomNames[]>([]);

	useEffect(() => {
		const fetchRooms = async () => {
			console.log("fetching rooms");
			const fetchedRooms = await fetchFacultyRooms("FAST"); // only for testing, soon change to faculty
			// console.log("fetched rooms",fetchedRooms);
			if (Array.isArray(fetchedRooms)) {
				setRooms(fetchedRooms);

			} else {
				setRooms([]);
			}
		};

		fetchRooms();
	}, []);

	useEffect(() => {
		const options = {
			includeScore: true,
			// Adjust these options to fine-tune the fuzzy search
			keys: ["nazev"], // Assuming the rooms have a 'name' property to search against
		};

		const fuse = new Fuse(rooms, options);

		const result = query ? fuse.search(query).map(result => result.item) : [];
		setFilteredRooms(result.slice(0, 4)); // Take the top 4 results
	}, [query, rooms]);

	const handleExpand = () => {
		setIsExpanded(true);
	};

	const handleCollapse = () => {
		setTimeout(() => setIsExpanded(false), 100);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		// console.log("handling search");
		setQuery(event.target.value);
	};

	const handleRoomSearchClick = (room: RoomNames) => {
		setSelectedRoom(room.room_id);
		setSelectedFloor(room.floor_number);
		setIsExpanded(false);
		handleRoomSelection(room.room_id);
		setIsDrawerOpen(true);
	}

	return (
		<Box
			sx={{
				width: isExpanded ? "95%" : "3em",
				height: "3em",
				bgcolor: "black",
				borderRadius: isExpanded ? "0px" : "50%",
				transition: "all 0.3s ease",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "absolute",
				top: "3em",
				left: "0.5em",
				zIndex: 3,
			}}
			onClick={handleExpand}
		>
			{isExpanded ? (
				<>
					<InputBase
						autoFocus
						placeholder="Search…"
						inputProps={{ "aria-label": "search" }}
						onBlur={handleCollapse}
						onChange={handleSearch}
						sx={{
							color: "white",
							width: "100%",
							'.MuiInputBase-input': {
								padding: "10px 0",
								pl: "1em",
							},
						}}
					/>
					<Box sx={{ position: "absolute", top: "100%", width: "100%", bgcolor: "white", color: "black" }}>
						{filteredRooms.map((room, index) => (
							<Box key={ index }
							     sx={ { padding: "10px" } }
							     onClick={ () => handleRoomSearchClick(room)}>
								{room.nazev} : {room.floor_number}
							</Box>
						))}
					</Box>
				</>
			) : (
				<IconButton sx={{ color: "white", padding: 0 }}>
					<SearchIcon fontSize="large" />
				</IconButton>
			)}
		</Box>
	);
}
