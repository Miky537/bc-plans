import React from "react";
import Box from "@mui/material/Box";
import { Typography, Divider } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { DividerStyles } from "./styles";
import { FacultyType } from "../FacultySelection/FacultySelection";
import HistoryIcon from "@mui/icons-material/History";

interface TeacherCardProps {
	isSearchedItem: boolean;
	fullTeacherName: string | null;
	email: string | null;
	faculty: FacultyType | string | null;
	room_name: string | null;
	room_id: number;
	handleTeacherTabClick: (room_id: number, email: string | null,
	                        fullTeacherName: string | null, teacherRoomName: string | null,
	                        teacherFaculty: string | null | FacultyType) => void;
}

function TeacherCard({
	                     isSearchedItem,
	                     handleTeacherTabClick,
	                     room_id,
	                     fullTeacherName,
	                     room_name,
	                     faculty,
	                     email
                     }: TeacherCardProps) {

	console.log("TeacherCard rendered", faculty);


	return (
		<Box width="90%"
		     maxWidth="900px"
		     display="flex"
		     flexDirection="column"
		     position="relative"
		     justifyContent="flex-start"
		     py={ 1.5 }
		     m={ 1 }
		     bgcolor="#222831"
		     borderRadius="10px"
		     onClick={ () => handleTeacherTabClick(room_id, email, fullTeacherName, room_name, faculty) }
		>
			<Box display={ isSearchedItem? "block" : "none" }
			     position="absolute"
			     right={ 10 }
			     top="50%"
			     sx={ { transform: 'translateY(-50%)', } }>
				<HistoryIcon color="info" sx={ { fontSize: "2rem" } } />
			</Box>
			<Box display="flex"
			     alignItems="center"
			     justifyContent="flex-start"
			     gap={ 1.5 }>
				<AccountBoxIcon sx={ { pl: 2 } } />
				<Typography variant="h6">
					{ fullTeacherName }
				</Typography>
			</Box>
			<Box display="flex" justifyContent="flex-start" width="100%" flexDirection="column">
				<Box display="flex"
				     alignItems="center"
				     justifyContent="center"
				     gap={ 1.5 }
				     width="100%"
				     margin="auto"
				>
					<Box width="100%" display="flex" justifyContent="center">
						<Typography variant="h6" sx={ { textAlign: 'center' } }>
							{ room_name }
						</Typography>
					</Box>


				</Box>
				<Box display="flex"
				     alignItems="center"
				     justifyContent="space-evenly"
				     gap={ 1.5 }
				     width="90%"
				     margin="auto">
					<Box width="50%" display="flex" justifyContent="center">
						<Typography variant="body2">
							{ email }
						</Typography>
					</Box>
					<Divider flexItem orientation="vertical" sx={ DividerStyles } />
					<Box width="50%" display="flex" justifyContent="center">
						<Typography variant="body2"
						            sx={ { textAlign: 'center', textOverflow: "ellipsis" } }>
							{ faculty }
						</Typography>
					</Box>
				</Box>
			</Box>

		</Box>
	);
}

export default TeacherCard;
