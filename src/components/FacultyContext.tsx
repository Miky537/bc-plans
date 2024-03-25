import React, { createContext, useContext, useState } from 'react';
import { RoomDetails, fetchRoomInfo } from "./MapComponents/tempFile";
import { defaultState } from "./MapComponents/constants";
import { FacultyType } from "./FacultySelection/FacultySelection";
import { replaceCzechChars } from "./FloorSelection";

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
	selectedFloorNumber: number;
	setSelectedFloorNumber: (floorNumber: number) => void;

	selectedBuildingOriginal: string | undefined;
	setSelectedBuildingOriginal: (building: string | undefined) => void;
	selectedFloorOriginal: string | undefined;
	setSelectedFloorOriginal: (floor: string | undefined) => void;
	selectedRoomOriginal: string | undefined;
	setSelectedRoomOriginal: (room: string | undefined) => void;

	selectedRoomDetail: SelectedRoomDetail | undefined;
	setSelectedRoomDetail: (selectedRoomDetail: SelectedRoomDetail | undefined) => void;

	facultyChangeSource: "url" | "search";
	setFacultyChangeSource: (source: "url" | "search") => void;
}

const FacultyContext = createContext<FacultyTypeContext | undefined>(undefined);

interface RoomDetail {
	roomName: string | undefined;
	roomId: number | undefined;
	urlRoomName: string | undefined;
}

interface FloorDetail {
	floorName: string | undefined;
	floorId: number | undefined;
	floorNumber: number | undefined;
	urlFloorName: string | undefined;
}

interface BuildingDetail {
	buildingName: string | undefined;
	buildingId: number | undefined;
	urlBuildingName: string | undefined;
}

interface SelectedRoomDetail {
	RoomDetail: RoomDetail;
	FloorDetail: FloorDetail;
	BuildingDetail: BuildingDetail;
	Faculty: FacultyType;
}

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
	const [selectedRoomId, setSelectedRoomId] = useState<number | undefined>(undefined);
	const [roomData, setRoomData] = useState<RoomDetails>(defaultState);
	const [selectedBuilding, setSelectedBuilding] = useState<string | undefined>(undefined);
	const [selectedFloor, setSelectedFloor] = useState<string | undefined>(undefined);
	const [selectedFloorNumber, setSelectedFloorNumber] = useState<number>(1);
	const [selectedRoomDetail, setSelectedRoomDetail] = useState<SelectedRoomDetail | undefined>(undefined)
	const [facultyChangeSource, setFacultyChangeSource] = useState<"url" | "search">('url');

	const [selectedBuildingOriginal, setSelectedBuildingOriginal] = useState<string | undefined>(undefined);
	const [selectedFloorOriginal, setSelectedFloorOriginal] = useState<string | undefined>(undefined);
	const [selectedRoomOriginal, setSelectedRoomOriginal] = useState<string | undefined>(undefined);

	const handleRoomSelection = async(roomId?: number) => {

		if (roomId === undefined) {
			return;
		}
		await setSelectedRoomId(roomId); // Update state with selected room information

		let roomInfo: RoomDetails | undefined = await fetchRoomInfo(roomId);
		if (roomInfo === undefined) {
			setRoomData(defaultState);
			return;
		} else {
			await setRoomData(roomInfo);
			await setSelectedFaculty(roomInfo.building_info.zkratka_prezentacni.split(" ")[0] as FacultyType)
			const random = replaceCzechChars(roomInfo.floor_info.nazev)
			setSelectedFloor(random.replace(" ", "_"))
			setSelectedFloorNumber(roomInfo.floor_info.cislo)
			updateSelectedRoomDetail(roomInfo);
		}
	};


	const updateSelectedRoomDetail = (fetchedData: RoomDetails) => {
		setSelectedRoomDetail(() => {
			const adjustedRoomDetail: RoomDetail = {
				roomName: fetchedData.room_info.cislo,
				roomId: fetchedData.room_info.mistnost_id,
				urlRoomName: fetchedData.room_info.cislo,
			};

			const urlFloorName = replaceCzechChars(fetchedData.floor_info.nazev.replace(" ", "_"))
			const adjustedFloorDetail: FloorDetail = {
				floorName: fetchedData.floor_info.nazev,
				floorId: fetchedData.floor_info.podlazi_id,
				floorNumber: fetchedData.floor_info.cislo,
				urlFloorName: urlFloorName,
			};

			const urlBuildingName = replaceCzechChars(fetchedData.building_info.nazev_prezentacni.replace(" ", "_"))
			const adjustedBuildingDetail: BuildingDetail = {
				buildingName: fetchedData.building_info.nazev_prezentacni,
				buildingId: fetchedData.building_info.budova_id,
				urlBuildingName: urlBuildingName,
			};
			const faculty = fetchedData.building_info.zkratka_prezentacni.split(" ")[0];
			const newDetails: SelectedRoomDetail = {
				RoomDetail: adjustedRoomDetail,
				FloorDetail: adjustedFloorDetail,
				BuildingDetail: adjustedBuildingDetail,
				Faculty: faculty,
			};

			return newDetails;
		});
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
			selectedFloorNumber,
			setSelectedFloorNumber,
			selectedBuildingOriginal,
			setSelectedBuildingOriginal,
			selectedFloorOriginal,
			setSelectedFloorOriginal,
			selectedRoomOriginal,
			setSelectedRoomOriginal,

			selectedRoomDetail,
			setSelectedRoomDetail,

			facultyChangeSource,
			setFacultyChangeSource,
		} }>
			{ children }
		</FacultyContext.Provider>
	);
};