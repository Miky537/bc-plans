import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

import MapView from "@arcgis/core/views/MapView";
import { Coordinates } from "../components/MapComponents/types";


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
	setActivateAnimation: (activate: boolean) => void;
	activateAnimation: boolean;
	setArePinsVisible: (visible: boolean) => void;
	arePinsVisible: boolean;

	setDoesRoomExist: (exists: boolean) => void;
	doesRoomExist: boolean;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const useMapContext = () => {
	const context = useContext(MapContext);
	if (context === undefined) {
		throw new Error('useMapContext must be used within a MapProvider');
	}
	return context;
};

export const MapProvider = ({children} : { children: React.ReactNode }) => {
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
	const [activateAnimation, setActivateAnimation] = useState<boolean>(false);
	const [arePinsVisible, setArePinsVisible] = useState<boolean>(false);
	const [doesRoomExist, setDoesRoomExist] = useState<boolean>(false);

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
			activateAnimation,
			setActivateAnimation,
			arePinsVisible,
			setArePinsVisible,
			doesRoomExist,
			setDoesRoomExist
		} }>
			{ children }
		</MapContext.Provider>
	);
};