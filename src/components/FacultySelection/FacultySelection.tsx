import React, { useEffect } from 'react';
import Main from "../Main/Main";
import FacultyItem from "./FacultyItem";
import Box from "@mui/material/Box";
import { useMapContext } from "../MapComponents/MapContext";

export type FacultyType = "FIT" | "FAST" | "FSI" | "FEKT" | "FAVU" | "FCH" | "USI" | "FP" | "FA";
function FacultySelection() {

	const {setMapVisibility} = useMapContext();

	useEffect(() => {
		setMapVisibility(false);

		return () => { setMapVisibility(true); };
	}, [setMapVisibility]);

	return (
		<Main>
			<Box display="grid"
			     gridTemplateColumns="repeat(2, 1fr)" // Create two columns
			     rowGap={ 4 } columnGap={ 0 }
			     height="100%" justifyContent="flex-end"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white">
				<FacultyItem name="FIT" />
				<FacultyItem name="FAST" />
				<FacultyItem name="FSI" />
				<FacultyItem name="FEKT" />
				<FacultyItem name="FAVU" />
				<FacultyItem name="FCH" />
				<FacultyItem name="USI" />
				<FacultyItem name="FP" />
				<FacultyItem name="FA" />
			</Box>
		</Main>
	);
}

export default FacultySelection;
