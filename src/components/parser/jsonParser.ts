import roomData from '../../jsonFiles/areal-antoninska-mistnosti.json';
import buildingData from '../../jsonFiles/areal-antoninska-budovy.json';
import floorData from '../../jsonFiles/areal-antoninska-podlazi.json';
import { Room, Floor, Building } from "./types";


export function findRoomDetails(roomId: number): {
	room: Room | undefined,
	floor: Floor | undefined,
	building: Building | undefined
} {
	const room = roomData.find(r => r.mistnost_id === roomId);
	console.log("Roooomis: ", room);
	if (!room) {
		return {
			room: undefined,
			floor: undefined,
			building: undefined
		};
	}

	const floor = floorData.find(f => f.podlazi_id === room.podlazi_id);
	// console.log("Flooorissss: ", floor);
	const building = floor? buildingData.find(b => b.budova_id === floor.budova_id) : undefined;
	// console.log("building: ", building);
	return {room, floor, building};
}

export function findUniqueFloorNumbers(): number[] {
	const floorNumbers = floorData.map(f => f.cislo);
	const uniqueFloorNumbers = Array.from(new Set(floorNumbers)); // Remove duplicates
	return uniqueFloorNumbers.sort((a, b) => a - b); // Sort numerically
}



export function findRoomById(id: number): Room | undefined {
	const foundRoom = roomData.find(room => room.mistnost_id === id);
	return foundRoom;
}
export function findFloorById(id: number): Floor | undefined {
	const foundFloor = floorData.find(floor => floor.podlazi_id === id);
	return foundFloor;
}
export function findBuildingById(id: number): Building | undefined {
	const foundBuilding = buildingData.find(building => building.budova_id === id);
	return foundBuilding;
}