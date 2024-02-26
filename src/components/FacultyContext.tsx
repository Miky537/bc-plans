import React, { createContext, useContext, useState } from 'react';
import { RoomDetails, fetchRoomInfo } from "./MapComponents/tempFile";
import { defaultState } from "./MapComponents/constants";

interface FacultyType {
	selectedBuildingId: number | null;
	setSelectedBuildingId: (id: number | null) => void;
	selectedRoomId: number | undefined;
	setSelectedRoomId: (id: number | undefined) => void;
	roomData: RoomDetails;
	setRoomData: (roomData: RoomDetails) => void;
	handleRoomSelection: (roomId?: number) => void;
}

const FacultyContext = createContext<FacultyType | undefined>(undefined);

export const useFacultyContext = () => {
	const context = useContext(FacultyContext);
	if (context === undefined) {
		throw new Error('useBuildingContext must be used within a FacultyProvider');
	}
	return context;
}

export const FacultyProvider = ({ children }: { children: React.ReactNode }) => {
	// Initialize with a number; use 0 or another appropriate default value
	const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);
	// const [selectedRoom, setSelectedRoom] = useState<number | undefined>(0);
	const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(0);
	const [roomData, setRoomData] = useState<RoomDetails>(defaultState);

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
		} }>
			{children}
		</FacultyContext.Provider>
	);
};