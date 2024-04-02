import { FacultyType } from "../components/FacultySelection/FacultySelection";

export interface RoomDetail {
	roomName: string | undefined;
	roomId: number | undefined;
	urlRoomName: string | undefined;
}

export interface FloorDetail {
	floorName: string | undefined;
	floorId: number | undefined;
	floorNumber: number | undefined;
	urlFloorName: string | undefined;
}

export interface BuildingDetail {
	buildingName: string | null;
	buildingId: number | null;
	urlBuildingName: string | null;
}

export interface SelectedRoomDetail {
	RoomDetail: RoomDetail;
	FloorDetail: FloorDetail;
	BuildingDetail: BuildingDetail;
	Faculty: FacultyType;
}