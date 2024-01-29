import React from 'react';
import { SwipeableDrawerComponent } from "../../SwipeableDrawer/SwipeableDrawerComponent";
import { Room } from "../../parser/types";
import { InfoState } from "../MapHolder";

interface RoomInfoDrawerProps {
	roomInfo: any;
	onClose: () => void;
	onOpen: () => void;
	isDrawerOpen: boolean;
	roomData: InfoState;
}

const RoomInfoDrawer = ({roomInfo, onClose, isDrawerOpen, onOpen, roomData}: RoomInfoDrawerProps) => {
	// console.log("dataasos:", roomData);
	return (
		<SwipeableDrawerComponent isDrawerOpen={ isDrawerOpen }
		                          onOpen={ onOpen }
		                          onClose={ onClose }
		                          roomInfo={ roomInfo }
		                          roomData={ roomData } />

	);
};

export default RoomInfoDrawer;
