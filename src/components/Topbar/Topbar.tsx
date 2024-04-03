import React, { useState, useEffect } from "react";
import './Topbar.tsx.css';
import Box from "@mui/material/Box";
import WestIcon from '@mui/icons-material/West';
import IconButton from "@mui/material/IconButton";
import { useMapContext } from "../../Contexts/MapContext";
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
import { useFacultyContext } from "../../Contexts/FacultyContext";
import { SelectStyles, FormControlLabelStyles, svgStyle } from "./styles";
import { TopbarProps, FacultyIcons, Faculties } from "./types";


export function isFacultyType(value: any): value is FacultyType {
	return ["FIT", "FAST", "FSI", "FEKT", "FAVU", "FCH", "USI", "FP", "FA", "CESA", undefined].includes(value);
}

export function Topbar({ goBack, disabled }: TopbarProps) {
	const [displayTitle, setDisplayTitle] = useState<FacultyType | string>("");
	const location = useLocation();
	const { setCenterCoordinates, setZoom, setActivateAnimation, setArePinsVisible } = useMapContext();
	const {
		selectedFaculty,
		setSelectedFaculty,
		facultyChangeSource,
		setFacultyChangeSource,
		setSelectedRoomId
	} = useFacultyContext();
	const navigate = useNavigate();
	const pathParts = location.pathname.split('/').filter(Boolean);
	const facultyName = pathParts[1];
	const facultyType = convertPathToFacultyType(facultyName);
	const [faculty, setFaculty] = useState<FacultyType | string>(facultyType || selectedFaculty || "");


	const isOnFacultyPage = location.pathname === '/faculty';
	const isOnFavPlacesPage = location.pathname === '/fvPlaces';
	const isOnTeacherPage = location.pathname === '/teacher';


	useEffect(() => {
		if (isOnFavPlacesPage) {
			setDisplayTitle("Favourite places");
		} else if (isOnFacultyPage) {
			setDisplayTitle("Select faculty");
		} else if (isOnTeacherPage) {
			setDisplayTitle("Teacher search");
		} else {
			setDisplayTitle("");
		}
	}, [facultyType, selectedFaculty, setSelectedFaculty, isOnFacultyPage, isOnFavPlacesPage, displayTitle, isOnTeacherPage]);

	useEffect(() => {
		setFacultyChangeSource('url');
	}, [location, setFacultyChangeSource])


	useEffect(() => {
		const pathParts = location.pathname.split('/').filter(Boolean);
		const urlFaculty = pathParts.length > 1? pathParts[1] : null;
		if (urlFaculty === null) {
			return
		}

		// Convert URL to faculty type
		const facultyFromUrl = convertPathToFacultyType(urlFaculty);
		if (facultyFromUrl && facultyFromUrl !== selectedFaculty) {
			if (facultyChangeSource === "url") {
				setSelectedRoomId(undefined);
				setSelectedFaculty(facultyFromUrl);
				setCenterCoordinates(getFacultyCoordinates(facultyFromUrl));
			}
		}
	}, [location, setSelectedFaculty, selectedFaculty, facultyChangeSource, setCenterCoordinates]);

	// Update state and context when URL changes
	useEffect(() => {
		if (facultyType) {
			setFaculty(facultyType);
		}
	}, [facultyType, selectedFaculty, setSelectedFaculty]);


	const handleChange = (event: SelectChangeEvent) => {
		setFaculty(event.target.value as string);
		setCenterCoordinates(getFacultyCoordinates(event.target.value as FacultyType));
		setSelectedFaculty(event.target.value as FacultyType);
		setZoom(17);
		setArePinsVisible(false);
		navigate(`/map/${ event.target.value.toUpperCase() }`)
	};

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
		if (!selectedFaculty)
			setZoom(12);
		if (selectedFaculty === undefined) {
			navigate(`/map`)
		} else {
			navigate(`/map/${ selectedFaculty }`)
		}
	}
	useEffect(() => {
		if (!isFacultyType(selectedFaculty)) {
			setSelectedFaculty(undefined);
			navigate(`/map`)
		}
	}, [selectedFaculty])
	const handleItemClick = (clickedFaculty: string) => {
		if (clickedFaculty === faculty) {
			setZoom(18);
			setActivateAnimation(true)
		}
	}


	return (
		<div className="Topbar" id="topbar">
			<IconButton sx={ { position: "absolute", left: 0, display: !isOnFacultyPage? "inline" : "none" } }
			            onClick={ goBack }>
				<WestIcon sx={ { color: "white" } } />
			</IconButton>
			<Box>
				{ !isOnFacultyPage && !isOnFavPlacesPage && !isOnTeacherPage?
					<FormControl sx={ FormControlLabelStyles }>
						<InputLabel>Select faculty</InputLabel>
						<Select
							value={ selectedFaculty? selectedFaculty : "" }
							className="faculty-select-topbar"
							onChange={ handleChange }
							sx={ SelectStyles }
							disabled={ disabled }
						>
							{ Faculties.map((faculty) =>
								<MenuItem key={ faculty }
								          onClick={ () => {
									          handleItemClick(faculty)
								          } }
								          value={ faculty }
								          sx={ {
									          height: "2em",
									          padding: 0,
									          minHeight: "2.5em",
									          display: "flex",
									          justifyContent: "flex-start",
								          } }>
									{ facultyIcons[faculty] }
								</MenuItem>
							) }
						</Select>
					</FormControl> :
					<Typography variant="h5">{ displayTitle }</Typography>
				}
			</Box>
			<IconButton onClick={ handleMapIconClick } sx={ {
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
