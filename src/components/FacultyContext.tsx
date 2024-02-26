import React, { createContext, useContext, useState } from 'react';
import { RoomDetails, fetchRoomInfo } from "./MapComponents/tempFile";
import { defaultState } from "./MapComponents/constants";
import { FacultyType } from "./FacultySelection/FacultySelection";

interface FacultyTypeContext {
	selectedBuildingId: number | null;
	setSelectedBuildingId: (id: number | null) => void;
	selectedRoomId: number | undefined;
	setSelectedRoomId: (id: number | undefined) => void;
	roomData: RoomDetails;
	setRoomData: (roomData: RoomDetails) => void;
	handleRoomSelection: (roomId?: number) => void;
	selectedFaculty: FacultyType;
	setSelectedFaculty: (faculty: FacultyType) => void;
	selectedBuilding: string | undefined;
	setSelectedBuilding: (building: string | undefined) => void;
	selectedFloor: string | undefined;
	setSelectedFloor: (floor: string | undefined) => void;
}

const FacultyContext = createContext<FacultyTypeContext | undefined>(undefined);

export const useFacultyContext = () => {
	const context = useContext(FacultyContext);
	if (context === undefined) {
		throw new Error('useBuildingContext must be used within a FacultyProvider');
	}
	return context;
}

export const FacultyProvider = ({ children }: { children: React.ReactNode }) => {

	const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
	const [selectedFaculty, setSelectedFaculty] = useState<FacultyType | undefined>(undefined);
	const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(0);
	const [roomData, setRoomData] = useState<RoomDetails>(defaultState);
	const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>(undefined);
	const [selectedFloor, setSelectedFloor] = useState<string | undefined>(undefined);

	const handleRoomSelection = async(roomId?: number) => {
		if (roomId === undefined) {
			return;
		}
		setSelectedRoomId(roomId); // Update state with selected room information

		let roomInfo: RoomDetails | undefined = await fetchRoomInfo(roomId);
		if (roomInfo === undefined) {
			console.log("Didnt find room!");
			setRoomData(defaultState);
			return;
		}
		if (roomInfo.room_info === undefined) {
			console.log("Didnt find room!");
			setRoomData(defaultState);
			return;
		} else {
			await setRoomData(roomInfo);
		}
	};

	return (
		<FacultyContext.Provider value={ {
			selectedBuildingId,
			setSelectedBuildingId,
			selectedRoomId,
			setSelectedRoomId,
			roomData,
			setRoomData,
			handleRoomSelection,
			selectedFaculty,
			setSelectedFaculty,
			selectedBuilding,
			setSelectedBuilding,
			selectedFloor,
			setSelectedFloor,
		} }>
			{children}
		</FacultyContext.Provider>
	);
};