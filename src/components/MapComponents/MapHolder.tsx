import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import { findUniqueFloorNumbers } from "../parser/jsonParser";
import { Room, Floor, Building } from "../parser/types";
import FloorHolder from "./FloorHolder";
import { SearchComponent } from "../SearchComponent/SearchComponent";
import { useFacultyContext } from "../FacultyContext";
import { SwipeableDrawerComponent } from "../SwipeableDrawer/SwipeableDrawerComponent";

export interface InfoState {
	room: Room | undefined;
	floor: Floor | undefined;
	building: Building | undefined;
}

const MapHolder = () => {

	const [floors, setFloors] = useState(findUniqueFloorNumbers());
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const {
		selectedRoomId,
		setSelectedRoomId,
		handleRoomSelection,
		roomData,
		selectedFloorNumber,
		setSelectedFloorNumber
	} = useFacultyContext();
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
		setSelectedFloorNumber(newFloor); // Update the selected floor
	};

	return (
		<div>
			<SearchComponent setSelectedRoom={ setSelectedRoomId }
			                 setSelectedFloor={ setSelectedFloorNumber }
			                 setIsDrawerOpen={ setIsDrawerOpen } />
			<FloorHolder
				floors={ floors }
				onFloorChange={ changeFloor }
				selectedFloor={ selectedFloorNumber }
			/>
			<MapComponent onRoomSelection={ handleRoomSelection }
			              selectedFloor={ selectedFloorNumber }
			              setIsDrawerOpen={ setIsDrawerOpen }
			              selectedRoom={ selectedRoomId }
			              setSelectedRoom={ setSelectedRoomId }
			/>
			<SwipeableDrawerComponent isDrawerOpen={ isDrawerOpen }
			                          onClose={ handleClose }
			                          onOpen={ handleOpen }
			                          roomData={ roomData } />
		</div>
	);
};

export default MapHolder;
