import React from 'react';
import { SwipeableDrawerComponent } from "../../SwipeableDrawer/SwipeableDrawerComponent";
import { RoomDetails } from "../tempFile";

interface RoomInfoDrawerProps {
	roomInfo: any;
	onClose: () => void;
	onOpen: () => void;
	isDrawerOpen: boolean;
	roomData: RoomDetails;
}

const RoomInfoDrawer = ({roomInfo, onClose, isDrawerOpen, onOpen, roomData}: RoomInfoDrawerProps) => {
	return (
		<SwipeableDrawerComponent isDrawerOpen={ isDrawerOpen }
		                          onOpen={ onOpen }
		                          onClose={ onClose }
		                          roomInfo={ roomInfo }
		                          roomData={ roomData } />

	);
};

export default RoomInfoDrawer;
