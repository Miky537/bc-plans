import React from "react";

export interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
}

export interface Teachers {
	aktualni_predmet_id: number | null;
	email: string | null;
	fakulta_id: number | null
	fakulta_zkratka: string | null;
	garant: string | null;
	garant_id: number | null;
	jazyk_vyuky: string | null;
	key1_contains: number | null;
	key1_exact: number | null;
	key1_starts: number | null;
	key2_contains: number | null;
	key2_exact: number | null;
	key2_starts: number | null;
	key3_contains: number | null;
	key3_exact: number | null;
	key3_starts: number | null;
	label: string | null;
	login_o365: string | null
	login_vut: string | null;
	mistnost: string | null;
	mistnost_id: number | null;
	per_id: number | null;
	per_sex: string | null;
	poradi: number | null;
	predmet_id: number | null;
	predmet_nazev: string | null;
	predmet_zkratka: string | null;
	skupina: string | null;
	telefon: string | null;
	typ: string | null;
	typ_semestru_id: number | null;
	typ_semestru_popis: string | null;
}



export interface AuthType {
	db_session_id: number;
	db_session_token: string;
	format: string;
	http_session_token: string;
	log_status_id: number
	message_cz: string
	message_en: string
	per_id: number;
	per_label: string;
	per_label_pr: string;
	per_login: string;
	readonly: boolean;
}