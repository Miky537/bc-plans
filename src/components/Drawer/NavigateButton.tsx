import { Button, Typography } from "@mui/material";
import React from "react";


export default function NavigateButton({ address }: { address: string }) {

	return(
		<Button sx={ { position: "absolute", bottom: 0, width: "90%", height: { xs: 40, sm: 50, lg: 100 } } }
		        variant="contained"
		        onClick={ () => {
			        window.open(`https://www.google.com/maps/dir/?api=1&destination=${ encodeURIComponent(address) }`, '_blank');
		        } }>
			<Typography>Navigovat</Typography>
		</Button>
	)
}