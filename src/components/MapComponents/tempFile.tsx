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
		const response = await fetch(`http://192.168.0.129:5000/api/room/${ roomId }`);
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

export const fetchFacultyRooms = async(faculty: FacultyType) => {
	try {
		const response = await fetch(`http://192.168.0.129:5000/api/faculty/${ faculty }`);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data: RoomDetails = await response.json();
		console.log("Faculty rooms:", data);
		return data;
	} catch (error) {
		console.error('Error:', error);
		return undefined;
	}
};