export interface Building {
	budova_id: number;
	areal_id: number,
	dokument_id: number | null,
	nazev: string,
	nazev_en: string | null
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
	platnost_do: string | null,
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
	zkratka_prezentacni: string | null
	zkratka_prezentacni_en: string | null,
	nazev_prezentacni: string | null,
	nazev_prezentacni_en: string | null,
}
export interface Floor {
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

export interface Areal {
	areal_id: number;
	lokalita_id: number;
	dokument_id: number;
	nazev: string;
	nazev_en: string | null;
	kod: string;
	popis: string | null;
	popis_en: string | null;
	poznamka: string | null;
	gtfvut3_id: number;
	upd_ts: string | null;
	upd_uid: number;
	ins_ts: string | null;
	ins_uid: number;
	status: number;
	platnost_od: string | null;
	platnost_do: string | null;
	aktualni: number;
	externi: number;
	nazev_puvodni: string | null;
}

export interface RoomDetails {
	room_info: Room;
	floor_info: Floor;
	building_info: Building;
	areal_info: Areal;
}

export type Coordinates = {
	lat: number;
	lng: number;
};

export interface RoomIdWithType {
	RoomID: number;
	roomType: number;
	roomName: string;
}