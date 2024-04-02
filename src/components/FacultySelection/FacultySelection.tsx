import React, { useEffect } from 'react';
import FacultyItem from "./FacultyItem";
import Box from "@mui/material/Box";
import { useMapContext } from "../../Contexts/MapContext";
import { useNavigate } from "react-router-dom";
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
import { Button, Typography } from "@mui/material";
import { useFacultyContext } from "../../Contexts/FacultyContext";

export type FacultyType = "FIT" | "FAST" | "FSI" | "FEKT" | "FAVU" | "FCH" | "USI" | "FP" | "FA" | "CESA" | undefined;

function FacultySelection() {

	const { setMapVisibility } = useMapContext();
	const { selectedFaculty } = useFacultyContext();
	const navigate = useNavigate();

	useEffect(() => {
		setMapVisibility(false);

		return () => {
			setMapVisibility(true);
		};
	}, [setMapVisibility]);

	const handleGoToMap = () => {
		if (selectedFaculty) {
			navigate(`/map/${ selectedFaculty }`);
		} else {
			navigate(`/map`);
		}
	}

	return (
		<Box display="flex"
		     flexDirection="column"
		     justifyContent="center"
		     bgcolor="background.paper"
		     height="fit-content"
		     pt={ 4 }
		     pb={ 7 }
		     maxWidth="1440px"
		     margin="auto">
			<Box display="grid"
			     gridTemplateColumns="repeat(2, minmax(150px, 0.3fr))"
			     rowGap={ 4 }
			     columnGap={ { xs: '0px', sm: '15px', md: '20px' } }
			     justifyContent="center"
			     minHeight="fit-content"
			     height="100%"
			     mb={ 4 }
			     color="white"
			>
				<FacultyItem name="FIT" Image={ FitLogo } />
				<FacultyItem name="FAST" Image={ FastLogo } />
				<FacultyItem name="FSI" Image={ FsiLogo } />
				<FacultyItem name="FEKT" Image={ FektLogo } />
				<FacultyItem name="FAVU" Image={ FavuLogo } />
				<FacultyItem name="FCH" Image={ FchLogo } />
				<FacultyItem name="USI" Image={ UsiLogo } />
				<FacultyItem name="FP" Image={ FpLogo } />
				<FacultyItem name="FA" Image={ FaLogo } />
				<FacultyItem name="CESA" Image={ CesaLogo } />
			</Box>
			<Button variant="contained"
			        onClick={ handleGoToMap }
			        sx={{
				        position: "fixed",
				        bottom: 0,
				        left: "50%",
				        transform: 'translateX(-50%)',
				        width: "100%",
				        maxWidth: "1440px",
				        height: "5em"
			        }}>
				<Typography variant="h5" sx={ {
					display: "flex",
					alignItems: "center"
				} }
				>Go to map</Typography>
			</Button>
		</Box>

	);
}

export default FacultySelection;
