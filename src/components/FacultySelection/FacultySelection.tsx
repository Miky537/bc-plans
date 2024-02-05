import React from 'react';
import Main from "../Main/Main";
import FacultyItem from "./FacultyItem";
import Box from "@mui/material/Box";

export type FacultyType = "FIT" | "FAST" | "FSI" | "FEKT" | "FAVU" | "FCH" | "USI" | "FP" | "FA";
function FacultySelection() {

	return (
		<Main>
			<Box display="grid"
			     gridTemplateColumns="repeat(2, 1fr)" // Create two columns
			     gap={ 4 }
			     height="100%"
			     pt={ 1 } pb={ 4 }>
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
