import roomData from '../../jsonFiles/areal-antoninska-mistnosti.json';
import buildingData from '../../jsonFiles/areal-antoninska-budovy.json';
import floorData from '../../jsonFiles/areal-antoninska-podlazi.json';

export interface Building {
	budova_id: number;
	areal_id: number,
	dokument_id: any,
	nazev: string,
	nazev_en: any,
	kod: string,
	popis: string | null,
	popis_en: string | null,
	poznamka: string | null,
	gtfvut3_id: number,
	st01_id: number,
	upd_ts: string,
	upd_uid: number,
	ins_ts: string,
	ins_uid: number,
	status: number,
	platnost_od: string,
	platnost_do: any,
	aktualni: number,
	adr_obec: string,
	adr_obec_cast: string,
	adr_psc: string,
	adr_ulice: string,
	adr_cislo_orientacni: string,
	adr_cislo_popisne: string,
	technicky_stav_id: number,
	rok_vystavby: number,
	kulturni_pamatka: number,
	plocha_zastavena: number,
	prostor_obestaveny: number,
	zkratka: string,
	externi: number,
	adresa: string,
	souradnice_n: number,
	souradnice_e: number,
	zkratka_prezentacni: any,
	zkratka_prezentacni_en: any,
	nazev_prezentacni: any,
	nazev_prezentacni_en: any
}
interface Floor {
	podlazi_id: number;
	budova_id: number;
	dokument_id: number | null;
	nazev: string;
	nazev_en: string | null;
	kod: string;
	cislo: number; // floor number
	popis: string | null;
	popis_en: string | null;
	poznamka: string | null;
	gtfvut3_id: number;
	upd_ts: string;
	upd_uid: number;
	ins_ts: string;
	ins_uid: number;
	status: number;
	platnost_od: string;
	platnost_do: string | null;
	aktualni: number;
	podlazi_typ_id: number;
	externi: number;
}

export interface Room {
	mistnost_id: number;
	podlazi_id: number;
	mistnost_typ_old_id: number | null;
	dokument_id: number | null;
	nazev: string;
	nazev_en: string | null;
	kod: string;
	cislo: string;
	mistni_nazev: string | null;
	cislo_na_vykresu: string | null;
	popis: string | null;
	popis_en: string | null;
	poznamka: string | null;
	label: string;
	pocet_mist: number | null;
	pro_vyuku: number | null;
	plocha_uzitna: number | null
	plocha_obsazena: number | null;
	plocha_volna: number | null;
	delka: number | null
	sirka: number | null;
	vyska: number | null;
	obvod: number | null;
	objem: number | null;
	povrch_sten_id: number | null
	povrch_stropu_id: number | null;
	povrch_podlahy_id: number | null;
	gtfvut3_id: number | null
	st01_id: number | null;
	upd_ts: string | null;
	upd_uid: number | null;
	ins_ts: string | null;
	ins_uid: number | null;
	status: number | null;
	platnost_od: string | null;
	platnost_do: string | null;
	aktualni: number;
	vyska_min: number | null;
	vyska_max: number | null;
	url: string | null;
	mistnost_typ_id: number;
	mistnost_zarazeni_id: number;
	externi: number;
	label_adr: string;
	adresa: string;
	fakulta_id: number;
	souradnice_n: number | null;
	souradnice_e: number | null;
	nazev_prezentacni: string | null;
	url_foto: string | null;
	nadrazena_mistnost_id: number | null;
	popis_web: string | null;
	popis_web_en: string | null;
	bezbarierova: number;
	zkratka: string | null;
	zkratka_en: string | null;
}

export function findRoomDetails(roomId: number): {
	room: Room | undefined,
	floor: Floor | undefined,
	building: Building | undefined
} {
	const room = roomData.find(r => r.mistnost_id === roomId);
	if (!room) {
		return {room: undefined, floor: undefined, building: undefined};
	}

	const floor = floorData.find(f => f.podlazi_id === room.podlazi_id);
	const building = floor? buildingData.find(b => b.budova_id === floor.budova_id) : undefined;

	return {room, floor, building};
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

export function loadJsonData(): Promise<Room[]> {
	return fetch('../../jsonFiles/areal-antoninska-budovy.json')
		.then(response => response.json());
}

// loadJsonData().then(buildingsData => {
// 	const building = findBuildingById(128, buildingsData);
// 	console.log(building);
// });