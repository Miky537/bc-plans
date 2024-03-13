import React, { createContext, useContext, useState, useRef } from 'react';
import { Coordinates } from "./MapComponent";
import MapView from "@arcgis/core/views/MapView";


interface MapContextType {
	centerCoordinates: Coordinates;
	setCenterCoordinates: (coordinates: Coordinates) => void;
	isMapVisible: boolean;
	setMapVisibility: (visible: boolean) => void; // Function to toggle visibility
	floors: number[];
	setFloors: React.Dispatch<React.SetStateAction<number[]>>;
	isMapLoaded: boolean;
	setIsMapLoaded: (loaded: boolean) => void;
	zoom: number;
	setZoom: (zoom: number) => void;
	selectedFloorRoomsIds : number[];
	setSelectedFloorRoomsIds : React.Dispatch<React.SetStateAction<number[]>>;
	mapViewRef: React.MutableRefObject<MapView | null>;
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
	const [floors, setFloors] = useState<number[]>([]);
	const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
	const [zoom, setZoom] = useState<number>(18);
	const [selectedFloorRoomsIds, setSelectedFloorRoomsIds] = useState<number[]>([]);
	const mapViewRef = useRef<MapView | null>(null);

	return (
		<MapContext.Provider value={ {
			centerCoordinates,
			setCenterCoordinates,
			isMapVisible,
			setMapVisibility,
			setFloors,
			floors,
			isMapLoaded,
			setIsMapLoaded,
			zoom,
			setZoom,
			selectedFloorRoomsIds,
			setSelectedFloorRoomsIds,
			mapViewRef,
		} }>
			{ children }
		</MapContext.Provider>
	);
};