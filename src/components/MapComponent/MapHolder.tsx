import React, { useState } from 'react';
import MapComponent from './MapComponent';
import FloorHolder from './FloorHolder';

const MapHolder = () => {
	const [selectedFloor, setSelectedFloor] = useState('2');
	const [floors, setFloors] = useState([]);

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
			/>
		</div>
	);
};

export default MapHolder;
