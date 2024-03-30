import React, { useState, useEffect } from 'react';
import Main from "../Main/Main";
import Box from "@mui/material/Box";
import { Tab, Tabs, Paper } from "@mui/material";
import FacultySelection from "../FacultySelection/FacultySelection";
import TeacherRooms from "./TeacherRooms";
import TabPanel from "./TabPanel";
import { TabStyles } from "./styles";
import { useNavigate, useLocation } from "react-router-dom";

function TeacherSearch() {
	const [value, setValue] = useState(0);
	const navigate = useNavigate();
	const location = useLocation();
	const currentPath = location.pathname;
	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		if (newValue === 0) {
			navigate(`/faculty`, { replace: true });
		} else {
			navigate(`/teacher`, { replace: true });
		}
		setValue(newValue);
	};
	useEffect(() => {
		if (currentPath === '/teacher') {
			setValue(1);
		} else if (currentPath === '/faculty') {
			setValue(0);
		}
	}, [currentPath]);

	return (
		<Main>
			<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', position: "sticky", top: 0, zIndex: 1100 }}>
					<Paper square>
						<Tabs value={value} onChange={handleChange} variant="fullWidth" sx={{ maxWidth: "900px", margin: "auto" }}>
							<Tab label="Faculty selection" value={0} />
							<Tab label="Teachers' offices" value={1} />
						</Tabs>
					</Paper>
				</Box>
				<Box sx={{ flexGrow: 1, overflowY: 'auto' }}> {/* This Box becomes the scroll container */}
					<TabPanel value={value} index={0}>
						<FacultySelection />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<TeacherRooms />
					</TabPanel>
				</Box>
			</Box>

		</Main>
	);
}

export default TeacherSearch;

