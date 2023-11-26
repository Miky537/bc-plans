import React, { useState } from 'react';
import MapComponent from './MapComponent';
import FloorHolder from './FloorHolder';

const MapHolder = () => {
	const [selectedFloor, setSelectedFloor] = useState('2');
	const [floors, setFloors] = useState([]);
	const [roomInfo, setRoomInfo] = useState({});


	const handleRoomSelection = (info: any) => {
		setRoomInfo(info); // Update state with selected room information
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
		</div>
	);
};

export default MapHolder;
