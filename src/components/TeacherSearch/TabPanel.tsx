import React from "react";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import { TabPanelProps } from "./types";

function TabPanel(props: TabPanelProps) {
	const { children, value, index } = props;

	return (
		<Box
			role="tabpanel"
			hidden={ value !== index }
			id={ `full-width-tabpanel-${ index }` }
			aria-labelledby={ `full-width-tab-${ index }` }
			sx={ { width: "100%", height: "100%" } }
		>
			<Paper sx={ { height: "100%" } } square>
				{ value === index && (
					<Box sx={ { height: "100%" } }>
						{ children }
					</Box>
				) }
			</Paper>
		</Box>
	);
}

export default TabPanel;
