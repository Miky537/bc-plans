import { Building, Floor, Room, Areal } from "../parser/types";

export interface RoomDetails {
	room_info: Room;
	floor_info: Floor;
	building_info: Building;
	areal_info: Areal;
}

export const fetchRoomInfo = async(roomId: number) => {
	try {
		const response = await fetch(`http://127.0.0.1:5000/api/room/${ roomId }`);
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