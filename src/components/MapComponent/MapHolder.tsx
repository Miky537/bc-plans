import React, { useState, useCallback } from 'react';
import MapComponent from './MapComponent';
import DrawerComponent from './DrawerComponent';
import Box from '@mui/material/Box';


const MainComponent = () => {
	const [roomData, setRoomData] = useState<string | null>("Not set yet");
	const [selectedFloor, setSelectedFloor] = useState('2'); // Replace '2' with your initial floor

	const handleRoomClick = useCallback((data: any) => {
		console.log(data.číslo_podlaží);
		if (data.číslo_podlaží === selectedFloor) {
			setRoomData(data);
		} else {
			setRoomData(null);
		}
	}, [selectedFloor]);

	return (
		<Box>
			<MapComponent />
			{ roomData && <DrawerComponent roomData={ roomData } /> }
		</Box>
	);
};

export default MainComponent;
