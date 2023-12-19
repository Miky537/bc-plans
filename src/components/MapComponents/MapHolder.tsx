import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import RoomInfoDrawer from "./Drawer/RoomInfoDrawer";
import { findBuildingById, Room } from "../parser/jsonParser";
import FloorHolder from "./FloorHolder";


const MapHolder = () => {

	const defaultRoomData: Room = {
		mistnost_id: 0,
		podlazi_id: 0,
		mistnost_typ_old_id: 0,
		dokument_id: 0,
		nazev: "",
		nazev_en: "",
		kod: "",
		cislo: "",
		mistni_nazev: "",
		cislo_na_vykresu: "",
		popis: "",
		popis_en: "",
		poznamka: "",
		label: "",
		pocet_mist: 0,
		pro_vyuku: 0,
		plocha_uzitna: 0,
		plocha_obsazena: 0,
		plocha_volna: 0,
		delka: 0,
		sirka: 0,
		vyska: 0,
		obvod: 0,
		objem: 0,
		povrch_sten_id: 0,
		povrch_stropu_id: 0,
		povrch_podlahy_id: 0,
		gtfvut3_id: 0,
		st01_id: 0,
		upd_ts: "",
		upd_uid: 0,
		ins_ts: "",
		ins_uid: 0,
		status: 0,
		platnost_od: "",
		platnost_do: "",
		aktualni: 0,
		vyska_min: 0,
		vyska_max: 0,
		url: "",
		mistnost_typ_id: 0,
		mistnost_zarazeni_id: 0,
		externi: 0,
		label_adr: "",
		adresa: "",
		fakulta_id: 0,
		souradnice_n: 0,
		souradnice_e: 0,
		nazev_prezentacni: "",
		url_foto: "",
		nadrazena_mistnost_id: 0,
		popis_web: "",
		popis_web_en: "",
		bezbarierova: 0,
		zkratka: "",
		zkratka_en: "",
	};

	const [selectedFloor, setSelectedFloor] = useState('2');
	const [floors, setFloors] = useState([]);
	const [selectedRoomId, setSelectedRoomId] = useState(0);
	const selectedRoomIdRef = useRef(selectedRoomId);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [roomData, setRoomData] = useState<Room>(defaultRoomData);

	const handleRoomSelection = (roomId?: number) => {
		if (roomId === undefined) {
			console.log("Selected room id: ", roomId);
			return;
		}
		setIsDrawerOpen(true);
		setSelectedRoomId(roomId); // Update state with selected room information
		let roomInfo = findBuildingById(roomId);
		if (roomInfo === undefined) {
			return;
		} else {
			setRoomData(roomInfo);
		}

	};
	const handleOpen = useCallback(() => {
		setIsDrawerOpen(true);
	}, [setIsDrawerOpen]);

	const handleClose = useCallback(() => {
		setIsDrawerOpen(false);
	}, [setIsDrawerOpen]);

	useEffect(() => {
		selectedRoomIdRef.current = selectedRoomId;
	}, [selectedRoomId]);

	const changeFloor = (newFloor: any) => {
		setSelectedFloor(newFloor); // Update the selected floor
	};

	return (
		<div>
			<FloorHolder
				floors={ floors }
				onFloorChange={ changeFloor }
				selectedFloor={ selectedFloor }
			/>
			<MapComponent onRoomSelection={ handleRoomSelection }
			/>
			<RoomInfoDrawer roomInfo={ selectedRoomId }
			                isDrawerOpen={ isDrawerOpen }
			                onClose={ handleClose }
			                onOpen={ handleOpen }
			                roomData={ roomData } />
		</div>
	);
};

export default MapHolder;
