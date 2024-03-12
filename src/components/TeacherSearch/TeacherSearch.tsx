import React, { useState } from 'react';
import Main from "../Main/Main";
import Box from "@mui/material/Box";
import { Tab, Tabs, Paper } from "@mui/material";
import FacultySelection from "../FacultySelection/FacultySelection";
import TeacherRooms from "./TeacherRooms";
import TabPanel from "./TabPanel";
import { TabStyles } from "./styles";

function TeacherSearch() {
	const [value, setValue] = useState(0);
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<Main>
			<Box sx={ { borderBottom: 1, borderColor: 'divider' } }>
				<Paper square>
					<Tabs value={ value } onChange={ handleChange } variant="fullWidth">
						<Tab label="Faculty selection" value={ 0 } sx={TabStyles} />
						<Tab label="Teachers' offices" value={ 1 } sx={TabStyles}/>
					</Tabs>
				</Paper>
			</Box>
			<TabPanel value={ value } index={ 0 }>
				<FacultySelection />
			</TabPanel>
			<TabPanel value={ value } index={ 1 }>
				<TeacherRooms />
			</TabPanel>
		</Main>
	);
}

export default TeacherSearch;

