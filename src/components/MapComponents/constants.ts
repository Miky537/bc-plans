import { Room, Floor } from "../parser/types";
import { InfoState } from "./MapHolder";

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


const defaultFloorData: Floor = {

	podlazi_id: 0,
	budova_id: 0,
	dokument_id: null,
	nazev: "",
	nazev_en: null,
	kod: "",
	cislo: 0,
	popis: null,
	popis_en: null,
	poznamka: null,
	gtfvut3_id: 0,
	upd_ts: "",
	upd_uid: 0,
	ins_ts: "",
	ins_uid: 0,
	status: 0,
	platnost_od: "",
	platnost_do: null,
	aktualni: 0,
	podlazi_typ_id: 0,
	externi: 0
};

const defaultBuildingData = {
	budova_id: 0,
	areal_id: 0,
	dokument_id: 0,
	nazev: '',
	nazev_en: null,
	kod: '',
	popis: null,
	popis_en: null,
	poznamka: null,
	gtfvut3_id: 0,
	st01_id: 0,
	upd_ts: '',
	upd_uid: 0,
	ins_ts: '',
	ins_uid: 0,
	status: 0,
	platnost_od: '',
	platnost_do: null,
	aktualni: 0,
	adr_obec: '',
	adr_obec_cast: '',
	adr_psc: '',
	adr_ulice: '',
	adr_cislo_orientacni: '',
	adr_cislo_popisne: '',
	technicky_stav_id: 0,
	rok_vystavby: 0,
	kulturni_pamatka: 0,
	plocha_zastavena: 0,
	prostor_obestaveny: 0,
	zkratka: '',
	externi: 0,
	adresa: '',
	souradnice_n: 0,
	souradnice_e: 0,
	zkratka_prezentacni: '',
	zkratka_prezentacni_en: '',
	nazev_prezentacni: '',
	nazev_prezentacni_en: ''
}

export const defaultState: InfoState = {
	room: defaultRoomData,  // your existing defaultRoomData
	floor: defaultFloorData,  // similarly defined
	building: defaultBuildingData,  // similarly defined
};

export const geoJsonUrl = "https://gist.githubusercontent.com/Miky537/cb568efc11c1833a5cd54ba87e583db5/raw/5a32a29cc63a8a017de7e134150ee74b2f7779ac/rektorat-mistnosti.geojson";
export const smallGeoJsonUrl = "https://gist.githubusercontent.com/Miky537/60edaac3927c035cd92d064ea90f84ac/raw/8399f0c67ad662285c55080cc4b6a752f0a5db06/small-rektorat.geojson";
export const bigFile = "https://gist.githubusercontent.com/Miky537/a9e6492c6657ef53f212b700826c8df7/raw/48a9cebdd82474b56ba1957374ecb3e789c4a7e9/bigFile.geojson";
export const ultraShortFile = "https://gist.githubusercontent.com/Miky537/d2cbf6618da88eeb201d352c103cc829/raw/aca56cbb096cf7853a18aa1a21e643213cf4b89b/UltraShort.geojson";
export const featureLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/re_mistnosti2/FeatureServer";

export const fastLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/TempLayer/FeatureServer";