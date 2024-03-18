import React from "react";
import cesaLogo from "./cesa-logo.svg";
import faLogo from "./fa-logo.svg";
import fpLogo from "./fbm-logo.svg";
import fastLogo from "./fce-logo.svg";
import fchLogo from "./fch-logo.svg";
import fektLogo from "./feec-logo.svg";
import favuLogo from "./ffa-logo.svg";
import fitLogo from "./fit-logo.svg";
import fsiLogo from "./fme-logo.svg";
import usiLogo from "./ife-logo.svg";

const Faculties = ["FIT", "FAST", "FSI", "FEKT", "FAVU", "FCH", "USI", "FP", "FA"];

export const facultyInfo = {
	"FIT": {
		width: 247.648,
		logo: fitLogo,
	},
	"FAST": {
		width: 321.121,
		logo: fastLogo,
	},
	"FSI": {
		width: 251.159,
		logo: fsiLogo,
	},
	"FEKT": {
		width: 322.088,
		logo: fektLogo,
	},
	"FAVU": {
		width: 18.609,
		logo: favuLogo,
	},
	"FCH": {
		width: 282.266,
		logo: fchLogo,
		USILogo: usiLogo,
		USIWidth: 263.148,
	},
	"FP": {
		width: 225.377,
		logo: fpLogo,
	},
	"FA": {
		width: 223.439,
		logo: faLogo,
	},
};

export const FacultyIconsWithNames = {
	"FIT": fitLogo,
	"FAST": fastLogo,
	"FSI": fsiLogo,
	"FEKT": fektLogo,
	"FAVU": favuLogo,
	"FCH": fchLogo,
	"USI": usiLogo,
	"FP": fpLogo,
	"FA": faLogo,
	"CESA": cesaLogo
};
