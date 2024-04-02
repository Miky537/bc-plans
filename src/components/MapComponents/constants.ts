import { Room, Floor, RoomDetails } from "./types";

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

const defaultArealData = {
	"areal_id": 0,
	"lokalita_id": 0,
	"dokument_id": 0,
	"nazev": "",
	"nazev_en": null,
	"kod": "",
	"popis": null,
	"popis_en": null,
	"poznamka": null,
	"gtfvut3_id": 0,
	"upd_ts": "",
	"upd_uid": 0,
	"ins_ts": "",
	"ins_uid": 0,
	"status": 0,
	"platnost_od": "",
	"platnost_do": null,
	"aktualni": 0,
	"externi": 0,
	"nazev_puvodni": ""
}

export const defaultState: RoomDetails = {
	room_info: defaultRoomData,
	floor_info: defaultFloorData,
	building_info: defaultBuildingData,
	areal_info: defaultArealData,
};

type ColorMapping = Record<string, string>;
export const typeToColorMapping: ColorMapping = {
	"1": "#FF0000", // living room
	"2": "#ed913f", // utility room
	"3": "#0000FF", // ski room
	"4": "#ed913f", // lounge
	"5": "#FF00FF", // interpreting room
	"6": "#00FFFF", // lee
	"7": "#C0C0C0", // Civil defence shelter, toilet
	"8": "#808080", // hall
	"9": "#800000", // exhibition space
	"10": "#808000", // utility room
	"11": "#800080", // shooting range
	"12": "#008000", // Civil defence shelter, corridor
	"13": "#8d8d8d", // vestibule
	"14": "#000080", // Civil defence shelter, air conditioning engine room
	"15": "#FFA500", // Civil defence shelter
	"16": "#FA8072", // Installation area
	"17": "#E9967A", // cellar
	"18": "#ed913f", // shaft
	"19": "#CD5C5C", // workroom
	"20": "#ed913f", // archive
	"21": "#B22222", // social. facilities, toilet
	"22": "#ffff7f", // office
	"23": "#FF1493", // administration and service rooms
	"24": "#8d8d8d", // respirium, atrium
	"25": "#8d8d8d", // connecting walkway
	"26": "#3fbf3f", // WC for the disabled
	"27": "#3fbf3f", // WC, shower, sanitary facilities
	"28": "#FFC0CB", // accommodation management rooms
	"29": "#ed913f", // cloakroom
	"30": "#FFFFE0", // room
	"31": "#FFFACD", // common rooms (within the accommodation)
	"32": "#ed913f", // other - energy
	"33": "#FFEFD5", // cabinet/archive
	"34": "#FFE4B5", // other technical rooms, photocopier. printer
	"35": "#3fbf3f", // WC women
	"36": "#3fbf3f", // WC men
	"37": "#F0E68C", // atelier
	"38": "#3fbf3f", // washroom, hall WC
	"39": "#FFFF00", // outdoor playground
	"40": "#9ACD32", // outdoor stadium
	"41": "#556B2F", // outdoor area
	"42": "#6B8E23", // lounge
	"43": "#7CFC00", // mailroom
	"44": "#7FFF00", // vice-deans'/deans' office
	"45": "#ADFF2F", // reference library
	"47": "#80D3F0", // meeting room
	"48": "#ed913f", // electrical switchboard
	"49": "#ed913f", // telephone switchboard
	"50": "#ed913f", // reception
	"51": "#ed913f", // server, PC cluster IT
	"52": "#66CDAA", // projection booth
	"53": "#8FBC8F", // garage
	"54": "#ed913f", // copy room
	"56": "#008B8B", // photochamber
	"57": "#ed913f", // kitchen
	"58": "#00FFFF", // room (outside the dormitory)
	"59": "#40E0D0", // shop
	"61": "#48D1CC", // not specified
	"62": "#ffff7f", // teachers' office
	"63": "#ffff7f", // assistant/doctoral assistant's office
	"64": "#4682B4", // administration warehouse
	"65": "#6495ED", // office
	"67": "#80D3F0", // seminar room
	"68": "#1E90FF", // drawing room
	"69": "#80D3F0", // IT classroom
	"70": "#80D3F0", // auditorium
	"71": "#80D3F0", // laboratory
	"72": "#00008B", // warehouse (for teaching)
	"73": "#ed913f", // preparation room
	"74": "#80D3F0", // consultation room
	"75": "#8A2BE2", // reading room
	"76": "#9370DB", // study room
	"77": "#8B008B", // common room
	"78": "#8d8d8d", // foyer
	"79": "#8d8d8d", // study (in accommodation)
	"80": "#BA55D3", // sports hall
	"81": "#4d4d4d", // stairs
	"82": "#DDA0DD", // aerobics, gymnastics
	"83": "#8d8d8d", // entrance room
	"84": "#8d8d8d", // passage
	"85": "#8d8d8d", // ramp
	"86": "#8d8d8d", // Loggia
	"87": "#000000", // elevator
	"88": "#3fbf3f", // WC - personal
	"89": "#FF00FF", // playroom
	"90": "#3fbf3f", // washroom
	"91": "#ed913f", // cleaning room
	"92": "#FF00FF", // fitness
	"93": "#ed913f", // reception
	"94": "#4244ff", // Mensa
	"95": "#ed913f", // Kitcher
	"96": "#ed913f", // freezer
	"97": "#ed913f", // dispenser
	"98": "#FF00FF", // technical room
	"99": "#ed913f", // buffet
	"100": "#ed913f", // other auxiliary operation - catering
	"101": "#ed913f", // other auxiliary operation - catering
	"102": "#ed913f", // other auxiliary operation - catering
	"103": "#ed913f", // practical training workshop
	"108": "#ed913f", // control room
	"112": "#ed913f",  // other technical rooms
	"113": "#80D3F0",  // Library
	"114": "#ed913f",  // study room
	"116": "#ed913f",  // archive
	"117": "#80D3F0",  // library space
	"121": "#ed913f",  // other technical rooms
	"124": "#ed913f",  // trafo station
	"127": "#ed913f",  // transformer station
	"134": "#ed913f",  // Archive
	"140": "#8d8d8d",  // Entrance space
	"141": "#ed913f",  // Other helpful rooms
	"145": "#80D3F0",  // Laboratory
	"147": "#8d8d8d",  // Other helpful rooms
	"150": "#3fbf3f",  // WC hallway
	"160": "#ed913f",  // Room
	"172": "#8d8d8d",  // Terrace
	"186": "#ed913f",  // Write room
};

export const iconProps = {
	width: "20px",
	height: "20px"
};

export const geoJsonUrl = "https://gist.githubusercontent.com/Miky537/cb568efc11c1833a5cd54ba87e583db5/raw/5a32a29cc63a8a017de7e134150ee74b2f7779ac/rektorat-mistnosti.geojson";
export const smallGeoJsonUrl = "https://gist.githubusercontent.com/Miky537/60edaac3927c035cd92d064ea90f84ac/raw/8399f0c67ad662285c55080cc4b6a752f0a5db06/small-rektorat.geojson";
export const bigFile = "https://gist.githubusercontent.com/Miky537/a9e6492c6657ef53f212b700826c8df7/raw/48a9cebdd82474b56ba1957374ecb3e789c4a7e9/bigFile.geojson";
export const ultraShortFile = "https://gist.githubusercontent.com/Miky537/d2cbf6618da88eeb201d352c103cc829/raw/aca56cbb096cf7853a18aa1a21e643213cf4b89b/UltraShort.geojson";
export const featureLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/re_mistnosti2/FeatureServer";

export const fastLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/TempLayer/FeatureServer";
export const FITLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/repairedFIT2Floor/FeatureServer";