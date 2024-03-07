import React, { useState, useEffect } from "react";
import './Topbar.tsx.css';
import Box from "@mui/material/Box";
import WestIcon from '@mui/icons-material/West';
import IconButton from "@mui/material/IconButton";
import { useMapContext } from "../MapComponents/MapContext";
import { Select, MenuItem, SelectChangeEvent, FormControl, InputLabel, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { FacultyType } from "../FacultySelection/FacultySelection";
import { ReactComponent as CesaLogo } from "../../FacultyLogos/cesa-logo.svg";
import { ReactComponent as FaLogo } from "../../FacultyLogos/fa-logo.svg";
import { ReactComponent as FpLogo } from "../../FacultyLogos/fbm-logo.svg";
import { ReactComponent as FastLogo } from "../../FacultyLogos/fce-logo.svg";
import { ReactComponent as FchLogo } from "../../FacultyLogos/fch-logo.svg";
import { ReactComponent as FektLogo } from "../../FacultyLogos/feec-logo.svg";
import { ReactComponent as FavuLogo } from "../../FacultyLogos/ffa-logo.svg";
import { ReactComponent as FitLogo } from "../../FacultyLogos/fit-logo.svg";
import { ReactComponent as FsiLogo } from "../../FacultyLogos/fme-logo.svg";
import { ReactComponent as UsiLogo } from "../../FacultyLogos/ife-logo.svg";
import MapIcon from '@mui/icons-material/Map';
import { getFacultyCoordinates, convertPathToFacultyType } from "../MapComponents/MapFunctions";
import { useFacultyContext } from "../FacultyContext";

interface TopbarProps {
	title?: string;
	goBack?: () => void;
}

type FacultyIcons = {
	[key: string]: React.ReactElement;
};

const Faculties = ["FIT", "FAST", "FSI", "FEKT", "FAVU", "FCH", "USI", "FP", "FA", "CESA"];


const FormControlLabelStyles = {
	"& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl": {
		top: "-18% !important",
	},
	"& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl.Mui-focused": {
		opacity: 0,
	},
	"& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-sizeMedium.MuiInputLabel-outlined.MuiFormLabel-colorPrimary.MuiFormLabel-filled.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-sizeMedium.MuiInputLabel-outlined": {
		opacity: 0,
	},
}

const SelectStyles = {
	"&": {
		display: "flex",
	},

	"&.faculty-select-topbar .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input": {
		paddingRight: "0em",
	},
	"&.faculty-select-topbar .MuiSelect-select svg": {
		height: "2em",
		width: "7em",
		padding: 0,
		display: "flex",
		paddingTop: "0.2em",
		paddingBottom: "0.2em",
	},
	"&.faculty-select-topbar .MuiSelect-select": {
		height: "2.5em",
		width: "9em",
		padding: 0,

	},
	"&.faculty-select-topbar .MuiSvgIcon-root": {
		width: "1em",
		height: "1em",
		color: "white",
	},
}

export function Topbar({title, goBack}: TopbarProps) {
	const [displayTitle, setDisplayTitle] = useState<FacultyType | string>("");
	const location = useLocation();
	const { setCenterCoordinates, setZoom } = useMapContext();
	const { selectedFaculty, setSelectedFaculty } = useFacultyContext();
	const navigate = useNavigate();

	const pathParts = location.pathname.split('/').filter(Boolean);
	const facultyName = pathParts[1];

	const facultyType = convertPathToFacultyType(facultyName);
	const isOnFacultyPage = location.pathname === '/faculty';
	const isOnFavPlacesPage = location.pathname === '/fvPlaces';

	const [faculty, setFaculty] = useState<FacultyType | string>(facultyType || selectedFaculty || "");

	// Update state and context when URL changes
	useEffect(() => {
		if (facultyType) {
			setFaculty(facultyType);
			if (facultyType !== selectedFaculty) {
				setSelectedFaculty(facultyType);
			}
		}
	}, [facultyType, selectedFaculty, setSelectedFaculty]);


	const handleChange = (event: SelectChangeEvent) => {
		setFaculty(event.target.value as string);
		setCenterCoordinates(getFacultyCoordinates(event.target.value as FacultyType));
		setSelectedFaculty(event.target.value as FacultyType);
		setZoom(17);
		navigate(`/map/${ event.target.value.toUpperCase() }`)
	};

	const svgStyle = {
		paddingLeft: "0.5em",
		width: "fit-content",
		height: "34px",
	}

	const facultyIcons: FacultyIcons = {
		"CESA": <CesaLogo style={ svgStyle } />,
		"FA": <FaLogo style={ svgStyle } />,
		"FP": <FpLogo style={ svgStyle } />,
		"FAST": <FastLogo style={ svgStyle } />,
		"FCH": <FchLogo style={ svgStyle } />,
		"FEKT": <FektLogo style={ svgStyle } />,
		"FAVU": <FavuLogo style={ svgStyle } />,
		"FIT": <FitLogo style={ svgStyle } />,
		"FSI": <FsiLogo style={ svgStyle } />,
		"USI": <UsiLogo style={ svgStyle } />
	};

	const handleMapIconClick = () => {
		setZoom(12);
		navigate(`/map`)
	}


	return (
		<div className="Topbar" id="topbar">
			<IconButton sx={ { position: "absolute", left: 0, display: !isOnFacultyPage ? "inline" : "none" } }
			            onClick={ goBack }>
				<WestIcon sx={ {color: "white"} } />
			</IconButton>
			<Box>
				{ !isOnFacultyPage?
					<FormControl sx={ FormControlLabelStyles }>
						<InputLabel>Select faculty</InputLabel>
						<Select
							value={ faculty? faculty : "" }
							className="faculty-select-topbar"
							onChange={ handleChange }
							sx={ SelectStyles }
						>
							{ Faculties.map((faculty) => {
								const Icon = facultyIcons[faculty]; // Get the corresponding icon component
								return (
									<MenuItem key={ faculty }
									          value={ faculty }
									          sx={ {
										          height: "2em",
										          padding: 0,
										          minHeight: "2.5em",
										          display: "flex",
										          justifyContent: "flex-start",
									          } }>
										{ Icon }
									</MenuItem>
								);
							}) }
						</Select>
					</FormControl> :
					<Typography variant="h5">Select faculty</Typography>
				}
			</Box>
			<IconButton onClick={handleMapIconClick} sx={ {
				position: "absolute",
				right: 5,
				padding: "0.2em",
				display: isOnFacultyPage? "flex" : "none",
				borderRadius: "50%",
				border: "1px solid white",
			} }>
				<MapIcon fontSize="medium" sx={ { color: "white" } } />
			</IconButton>
		</div>
	);
}
