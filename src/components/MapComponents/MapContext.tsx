import React, { createContext, useContext, useState } from 'react';
import { Coordinates } from "./MapComponent";


interface MapContextType {
	centerCoordinates: Coordinates;
	setCenterCoordinates: (coordinates: Coordinates) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
	const context = useContext(MapContext);
	if (context === undefined) {
		throw new Error('useMapContext must be used within a MapProvider');
	}
	return context;
};

export const MapProvider = ({children}: any) => {
	const [centerCoordinates, setCenterCoordinates] = useState<Coordinates>({
		lat: 16.603375432788052,
		lng: 49.20174147400288,
	});

	return (
		<MapContext.Provider value={ {centerCoordinates, setCenterCoordinates} }>
			{ children }
		</MapContext.Provider>
	);
};