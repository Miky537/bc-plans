import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import RoomInfoDrawer from "./Drawer/RoomInfoDrawer";
import { findUniqueFloorNumbers } from "../parser/jsonParser";
import { Room, Floor, Building } from "../parser/types";
import FloorHolder from "./FloorHolder";
import { defaultState } from "./constants";
import { fetchRoomInfo, RoomDetails } from "./tempFile";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import { SearchComponent } from "../SearchComponent/SearchComponent";

export interface InfoState {
	room: Room | undefined;
	floor: Floor | undefined;
	building: Building | undefined;
}

const MapHolder = () => {

	const [selectedFloor, setSelectedFloor] = useState(2);
	const [floors, setFloors] = useState(findUniqueFloorNumbers());
	const [selectedRoomId, setSelectedRoomId] = useState(0);
	const selectedRoomIdRef = useRef(selectedRoomId);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [roomData, setRoomData] = useState<RoomDetails>(defaultState);
	const [selectedRoom, setSelectedRoom] = useState<number | undefined>(0);
	const handleRoomSelection = async(roomId?: number) => {
		if (roomId === undefined) {
			return;
		}
		setSelectedRoomId(roomId); // Update state with selected room information

		let roomInfo: RoomDetails | undefined = await fetchRoomInfo(roomId);
		if (roomInfo === undefined) {
			console.log("Didnt find room!");
			setRoomData(defaultState);
			return;
		}
		if (roomInfo.room_info === undefined) {
			console.log("Didnt find room!");
			setRoomData(defaultState);
			return;
		} else {
			setRoomData(roomInfo);
		}

	};
	const handleOpen = useCallback(() => {
		setIsDrawerOpen(true);
	}, [setIsDrawerOpen]);

	const handleClose = useCallback(() => {
		setIsDrawerOpen(false);
	}, [setIsDrawerOpen]);

	useEffect(() => {
		selectedRoomIdRef.current = selectedRoomId;
	}, [selectedRoomId]);

	const changeFloor = (newFloor: any) => {
		setSelectedFloor(newFloor); // Update the selected floor
	};

	return (
		<div>
			<SearchComponent setSelectedRoom={setSelectedRoom}/>
			<FloorHolder
				floors={ floors }
				onFloorChange={ changeFloor }
				selectedFloor={ selectedFloor }
			/>
			<MapComponent onRoomSelection={ handleRoomSelection }
			              selectedFloor={ selectedFloor }
			              setIsDrawerOpen={ setIsDrawerOpen }
			              selectedRoom={selectedRoom}
			              setSelectedRoom={setSelectedRoom}
			/>
			<RoomInfoDrawer roomInfo={ selectedRoomId }
			                isDrawerOpen={ isDrawerOpen }
			                onClose={ handleClose }
			                onOpen={ handleOpen }
			                roomData={ roomData } />
		</div>
	);
};

export default MapHolder;
