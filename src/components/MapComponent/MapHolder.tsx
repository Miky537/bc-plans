import React, { useState, useEffect } from 'react';
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
			/>
			<MapComponent
				selectedFloor={selectedFloor}
				setFloors={setFloors}
			/>
		</div>
	);
};

export default MapHolder;
