import React, { useState } from 'react';
import MapComponent from './MapComponent';
import FloorHolder from './FloorHolder';
import RoomInfoDrawer from "./Drawer/RoomInfoDrawer";

const MapHolder = () => {
	const [selectedFloor, setSelectedFloor] = useState('2');
	const [floors, setFloors] = useState([]);
	const [roomInfo, setRoomInfo] = useState({});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	const handleRoomSelection = (info: any) => {
		setRoomInfo(info); // Update state with selected room information
		setIsDrawerOpen(true);
		console.log("Selected Room Info:", info); // For debugging
	};
	const changeFloor = (newFloor: any) => {
		setSelectedFloor(newFloor); // Update the selected floor
	};

	return (
		<div>
			<FloorHolder
				floors={floors}
				onFloorChange={changeFloor}
				selectedFloor={ selectedFloor }
			/>
			<MapComponent
				selectedFloor={selectedFloor}
				setFloors={setFloors}
				onRoomSelection={ handleRoomSelection }
			/>
			{isDrawerOpen && <RoomInfoDrawer roomInfo={roomInfo} onClose={() => setIsDrawerOpen(false)} />}
		</div>
	);
};

export default MapHolder;
