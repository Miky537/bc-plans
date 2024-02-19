import React, { createContext, useContext, useState } from 'react';
import { Coordinates } from "./MapComponent";
import { FacultyType } from "../FacultySelection/FacultySelection";


interface MapContextType {
	centerCoordinates: Coordinates;
	setCenterCoordinates: (coordinates: Coordinates) => void;
	isMapVisible: boolean;
	setMapVisibility: (visible: boolean) => void; // Function to toggle visibility
	selectedFaculty: FacultyType;
	setSelectedFaculty: (faculty: FacultyType) => void;
	floors: number[];
	setFloors: React.Dispatch<React.SetStateAction<number[]>>;
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

	const [isMapVisible, setMapVisibility] = useState<boolean>(true);
	const [selectedFaculty, setSelectedFaculty] = useState<FacultyType>("FAST");
	const [floors, setFloors] = useState<number[]>([]);

	return (
		<MapContext.Provider value={ {
			centerCoordinates,
			setCenterCoordinates,
			isMapVisible,
			setMapVisibility,
			selectedFaculty,
			setSelectedFaculty,
			setFloors,
			floors
		} }>
			{ children }
		</MapContext.Provider>
	);
};