import React, { useEffect } from 'react';
import FacultyItem from "./FacultyItem";
import Box from "@mui/material/Box";
import { useMapContext } from "../MapComponents/MapContext";
import { useNavigate } from "react-router-dom";
import { useFacultyContext } from "../FacultyContext";
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

export type FacultyType = "FIT" | "FAST" | "FSI" | "FEKT" | "FAVU" | "FCH" | "USI" | "FP" | "FA" | "CESA" | undefined;
function FacultySelection() {

	const {setMapVisibility} = useMapContext();
	const {setSelectedFaculty} = useFacultyContext();
	const navigate = useNavigate();

	useEffect(() => {
		setMapVisibility(false);

		return () => { setMapVisibility(true); };
	}, [setMapVisibility]);

	return (
			<Box display="grid"
			     gridTemplateColumns="repeat(2, 1fr)" // Create two columns
			     rowGap={ 4 } columnGap={ 0 }
			     height="100%" justifyContent="flex-end"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white" overflow="scroll">
				<FacultyItem name="FIT" Image={FitLogo} />
				<FacultyItem name="FAST" Image={FastLogo} />
				<FacultyItem name="FSI" Image={FsiLogo}/>
				<FacultyItem name="FEKT" Image={FektLogo}/>
				<FacultyItem name="FAVU" Image={FavuLogo}/>
				<FacultyItem name="FCH" Image={FchLogo}/>
				<FacultyItem name="USI" Image={UsiLogo}/>
				<FacultyItem name="FP" Image={FpLogo}/>
				<FacultyItem name="FA" Image={FaLogo}/>
				<FacultyItem name="CESA" Image={ CesaLogo } />
			</Box>
	);
}

export default FacultySelection;
