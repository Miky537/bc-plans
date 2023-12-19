import React, { useEffect } from 'react';
import { SwipeableDrawerComponent } from "../../SwipeableDrawer/SwipeableDrawerComponent";

interface RoomInfoDrawerProps {
	roomInfo: any;
	onClose: () => void;
	isDrawerOpen: boolean;
	onOpen: () => void;
}

const RoomInfoDrawer = ({roomInfo, onClose, isDrawerOpen, onOpen}: RoomInfoDrawerProps) => {

	useEffect(() => {
		console.log("RoomInfoDrawer: isDrawerOpen changed to", isDrawerOpen);
		console.log("RoomInfoDrawer: roomInfo changed to", roomInfo);
	}, [isDrawerOpen, roomInfo]);
	return (
		<SwipeableDrawerComponent isDrawerOpen={ isDrawerOpen } onOpen={ onOpen } onClose={ onClose } />

	);
};

export default RoomInfoDrawer;
