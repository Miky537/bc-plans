import React from "react";
import Box from "@mui/material/Box";
import { Typography, useTheme } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { FacultyType } from "../Selections/FacultySelection/FacultySelection";
import LocationOnIcon from '@mui/icons-material/LocationOn';

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
	isLast?: boolean;
}

function TeacherCard({
	                     isSearchedItem,
	                     handleTeacherTabClick,
	                     room_id,
	                     fullTeacherName,
	                     room_name,
	                     faculty,
	                     email,
	isLast
                     }: TeacherCardProps) {
	const theme = useTheme()

	return (
		<Box width="90%"
		     maxWidth="900px"
		     display="flex"
		     flexDirection="column"
		     position="relative"
		     alignItems="center"
		     justifyContent="flex-start"
		     py={ 1.5 }
		     m={ 1 }
		     sx={{ cursor: room_name? "pointer": "default"}}
		     mb={ isLast? "6em" : 1 }
		     bgcolor="#222831"
		     borderRadius="10px"
		     onClick={ () => handleTeacherTabClick(room_id, email, fullTeacherName, room_name, faculty) }
		>
			<LocationOnIcon sx={ {
				position: "absolute",
				right: "0.5em",
				top: "0.4em",
				borderRadius: "50%",
				color: room_name? "" : theme.palette.text.disabled
			} } />
			<Box display="flex"
			     width="90%"
			     alignItems="center"
			     justifyContent="flex-start"
			     gap={ 1.5 }>
				<AccountBoxIcon sx={ { color: room_name? "" : theme.palette.text.disabled } } />
				<Typography variant="h6"
				            fontWeight={ 600 }
				            sx={ { width: "80%", color: room_name? "" : theme.palette.text.disabled } }>
					{ fullTeacherName }
				</Typography>
			</Box>
			<Box display="flex" justifyContent="flex-start" width="90%" flexDirection="column">
				<Box display="flex"
				     alignItems="center"
				     justifyContent="center"
				     gap={ 1.5 }
				     width="100%"
				     position="absolute"
				     right="1em"
				     margin="auto"
				>
					<Box width="100%" display="flex" justifyContent="flex-end">
						<Typography variant="h5"
						            sx={ { textAlign: 'center', color: room_name? "" : theme.palette.text.disabled } }>
							{ room_name }
						</Typography>
					</Box>
				</Box>

				<Box display="flex"
				     alignItems="flex-start"
				     justifyContent="space-evenly"
				     flexDirection="column"
				     width="100%"
				     margin="auto">
					<Box width="50%" display="flex" justifyContent="flex-start">
						<Typography variant="body2" sx={ { color: room_name? "" : theme.palette.text.disabled } }>
							{ email }
						</Typography>
					</Box>
					<Box width="50%" display="flex" justifyContent="flex-start">
						<Typography variant="body2"
						            sx={ {
							            textAlign: 'center',
							            textOverflow: "ellipsis",
							            color: room_name? "" : theme.palette.text.disabled
						            } }>
							{ faculty }
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default TeacherCard;
