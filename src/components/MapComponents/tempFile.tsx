import { Building, Floor, Room, Areal } from "../parser/types";
import { FacultyType } from "../FacultySelection/FacultySelection";

export interface RoomDetails {
	room_info: Room;
	floor_info: Floor;
	building_info: Building;
	areal_info: Areal;
}

export const fetchRoomInfo = async(roomId: number) => {
	try {
		const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/room/${ roomId }`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: RoomDetails = await response.json();
		return data;
	} catch (error) {
		console.error('Error:', error);
		return undefined;
	}
};

export const fetchFacultyRooms = async() => {
	try {
		const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/rooms`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: RoomDetails = await response.json();
		return data;
	} catch (error) {
		console.error('Error:', error);
		return undefined;
	}
};