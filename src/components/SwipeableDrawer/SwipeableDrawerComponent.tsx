import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React from "react";


interface SwipeableDrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
}

export function SwipeableDrawerComponent({isDrawerOpen, onClose, onOpen}: SwipeableDrawerComponentProps) {

	return (
		<SwipeableDrawer
			anchor="bottom"
			open={ isDrawerOpen }
			onClose={ onClose }
			onOpen={ onOpen }
		>
			<div>Ahoj</div>
			<br />
			<div>Ahoj</div>
			<br />
			<div>Ahoj</div>
			<br />
			<div>Ahoj</div>
		</SwipeableDrawer>
	)
}
