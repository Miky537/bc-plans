import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import RoomInfoDrawer from "./Drawer/RoomInfoDrawer";
import { findBuildingById } from "../parser/jsonParser";


const MapHolder = () => {
	const [selectedFloor, setSelectedFloor] = useState('2');
	const [floors, setFloors] = useState([]);
	const [selectedRoomId, setSelectedRoomId] = useState(0);
	const selectedRoomIdRef = useRef(selectedRoomId);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleRoomSelection = async (roomId: number) => {
		setIsDrawerOpen(true);
		console.log("RoomId:", roomId); // Correct roomId

		await setSelectedRoomId(roomId); // Update state with selected room information

		// Use roomId directly instead of selectedRoomId or selectedRoomIdRef
		let roomInfo = findBuildingById(roomId);
		console.log("Room Info:", roomInfo);
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
			{/*<FloorHolder*/ }
			{/*	floors={floors}*/ }
			{/*	onFloorChange={changeFloor}*/ }
			{/*	selectedFloor={ selectedFloor }*/ }
			{/*/>*/ }
			<MapComponent onRoomSelection={ handleRoomSelection }
			/>
			{/*<RoomInfoDrawer roomInfo={ selectedRoomId }*/}
			{/*                isDrawerOpen={ isDrawerOpen }*/}
			{/*                onClose={ handleClose }*/}
			{/*                onOpen={ handleOpen } />*/}
		</div>
	);
};

export default MapHolder;
