import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import RoomInfoDrawer from "./Drawer/RoomInfoDrawer";
import { findUniqueFloorNumbers } from "../parser/jsonParser";
import { Room, Floor, Building } from "../parser/types";
import FloorHolder from "./FloorHolder";
import { defaultState } from "./constants";
import { fetchRoomInfo, RoomDetails } from "./tempFile";
import { SearchComponent } from "../SearchComponent/SearchComponent";
import { useFacultyContext } from "../FacultyContext";

export interface InfoState {
	room: Room | undefined;
	floor: Floor | undefined;
	building: Building | undefined;
}

const MapHolder = () => {

	const [selectedFloor, setSelectedFloor] = useState(2);
	const [floors, setFloors] = useState(findUniqueFloorNumbers());
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const { selectedRoomId, setSelectedRoomId, handleRoomSelection, roomData} = useFacultyContext();
	const selectedRoomIdRef = useRef(selectedRoomId);


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
			<SearchComponent setSelectedRoom={ setSelectedRoomId }
			                 setSelectedFloor={ setSelectedFloor }
			                 setIsDrawerOpen={ setIsDrawerOpen }
			                 handleRoomSelection={handleRoomSelection}/>
			<FloorHolder
				floors={ floors }
				onFloorChange={ changeFloor }
				selectedFloor={ selectedFloor }
			/>
			<MapComponent onRoomSelection={ handleRoomSelection }
			              selectedFloor={ selectedFloor }
			              setIsDrawerOpen={ setIsDrawerOpen }
			              selectedRoom={selectedRoomId}
			              setSelectedRoom={setSelectedRoomId}
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
