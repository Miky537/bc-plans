import React, { useEffect, useState, useCallback } from 'react';
import {
	Paper,
	TextField,
	Typography,
	Divider,
	InputAdornment,
	CircularProgress,
	debounce,
	useTheme
} from "@mui/material";
import Box from "@mui/material/Box";
import { useMutation, useQuery } from "react-query";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SearchIcon from "@mui/icons-material/Search";
import { Teachers, AuthType } from "./types";
import { useNavigate } from "react-router-dom";
import { useFacultyContext } from "../FacultyContext";
import { replaceCzechChars } from "../FloorSelection";
import { searchTeacher, login } from "./apiCalls";
import { TextFieldStyles, DividerStyles } from "./styles";

function TeacherRooms() {

	const [teacherName, setTeacherName] = useState('');
	const [teachers, setTeachers] = useState<Teachers[] | null>(null);
	const [roomId, setRoomId] = useState<number | null>(null);
	const theme = useTheme();
	const navigate = useNavigate();
	const {
		setSelectedFloorNumber,
		setSelectedRoomId,
		setSelectedFaculty,
		setSelectedBuilding,
		setSelectedFloor,
	} = useFacultyContext();

	const { refetch: refetchRoomInfo } = useQuery(
		['fetchRoomInfo', roomId],
		() => fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/room/${ roomId }`).then(res => res.json()), // Ensure you return the result of res.json()
		{
			enabled: false, // Initially, do not automatically run the query
		}
	);
	const { refetch } = useQuery({
			queryKey: ['searchTeacher', teacherName],
			queryFn: () => searchTeacher(teacherName),
			enabled: false, // Turn off automatic execution
			onSuccess: ({ data }) => {
				setTeachers(data.vysledky)
			},
		},
	);

	const {
		mutate: loginMutate,
		error: loginError,
		isSuccess: loginSuccess,
		isLoading
	} = useMutation(login, {
		onSuccess: (data: AuthType) => {
			const sessionToken = data.http_session_token;
			sessionStorage.setItem('sessionToken', sessionToken);
		},
		onError: (error) => {
			console.error('Login Error', error);
		},
	});
// eslint-disable-next-line
	const debouncedSearch = useCallback(
		debounce((searchValue: any) => {
			if (searchValue && loginSuccess) {
				refetch(); // Assuming refetch uses searchTerm or teacherName state that's updated here
			}
		}, 500), // 500ms delay
		[loginSuccess]
	);
	useEffect(() => {
		debouncedSearch(teacherName);
	}, [teacherName, debouncedSearch]);

	const handleInputChange = (event: any) => {
		setTeacherName(event.target.value);
	};

	useEffect(() => {
		loginMutate();
	}, [loginMutate]);

	const handleTeacherTabClick = async(roomId: number | null) => {
		if (roomId === null) {
			return;
		}
		await setRoomId(roomId);
		refetchRoomInfo().then(({ data }) => {
			setSelectedRoomId(roomId);
			setSelectedFaculty(data.building_info.zkratka_prezentacni.split(' ')[0]);
			const normalizedBuildingName = replaceCzechChars(data.building_info.nazev_prezentacni)!.replace(/\s/g, "_")
			setSelectedBuilding(data.building_info.nazev_prezentacni);
			const normalizedFloorName = replaceCzechChars(data.floor_info.nazev)!.replace(/\s/g, "_");
			setSelectedFloor(normalizedFloorName);
			setSelectedFloorNumber(data.floor_info.cislo);
			navigate(`/map/${ data.building_info.zkratka_prezentacni.split(' ')[0] }/${ normalizedBuildingName }/${ normalizedFloorName }/${ data.room_info.cislo }`);
		});
	}

	if (loginError) {
		return <div>Failed to login: { loginError.toString() }</div>;
	}

	return (
		<Box height="100vh">
			<Paper sx={ { margin: "auto", maxWidth: "900px" } }>
				<TextField
					id="search-bar"
					className="text"
					label="Enter a teacher's name..."
					variant="filled"
					placeholder="Search..."
					size="medium"
					fullWidth
					onChange={ handleInputChange }
					autoComplete="off"
					type="text"
					sx={ { ...TextFieldStyles } }
					disabled={ isLoading }
					InputProps={ {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon color={ isLoading? "disabled" : "primary" } />
							</InputAdornment>
						),
					} }
				/>
			</Paper>
			{ isLoading && !loginSuccess?
				<Box display="flex" width="100%" height="30em" justifyContent="center" alignItems="center">
					<CircularProgress size={ 100 } thickness={ 5 } />
				</Box>
				:
				<Paper sx={ {
					height: "fit-content",
					minHeight: "100vh",
					width: "100%",
					display: "flex",
					margin: "auto",
					alignItems: "center",
					flexDirection: "column"
				} } square>

					{ teachers?.map(({ label, mistnost, mistnost_id, email, fakulta_zkratka }, index) => (
						<React.Fragment key={ index }>
							<Box width="90%"
							     maxWidth="900px"
							     display="flex"
							     flexDirection="column"
							     justifyContent="flex-start"
							     py={ 1.5 }
							     m={ 1 }
							     bgcolor="#222831"
							     borderRadius="10px"
							     onClick={ () => handleTeacherTabClick(mistnost_id) }
							>
								<Box display="flex"
								     alignItems="center"
								     justifyContent="flex-start"
								     gap={ 1.5 }>
									<AccountBoxIcon sx={ { pl: 2 } } />
									<Typography variant="h6">
										{ label }
									</Typography>
								</Box>
								<Box display="flex"
								     alignItems="center"
								     justifyContent="space-evenly"
								     gap={ 1.5 }
								     width="90%"
								     margin="auto"
								>
									<Box width="25%" display="flex" justifyContent="center">
										<Typography variant="body2" sx={ { textAlign: 'center' } }>
											{ mistnost }
										</Typography>
									</Box>
									<Divider flexItem orientation="vertical" sx={ DividerStyles } />
									<Box width="50%" display="flex" justifyContent="center">
										<Typography variant="body2"
										            sx={ {
											            textAlign: 'center',
											            whiteSpace: 'nowrap',
											            overflow: 'hidden',
											            textOverflow: 'ellipsis'
										            } }>
											{ email }
										</Typography>
									</Box>
									<Divider flexItem orientation="vertical" sx={ DividerStyles } />
									<Box width="25%" display="flex" justifyContent="center">
										<Typography variant="body2" sx={ { textAlign: 'center' } }>
											{ fakulta_zkratka }
										</Typography>
									</Box>
								</Box>
							</Box>
							<Box display={ index === teachers?.length - 1? "none" : "block" }
							     height={ 2 }
							     bgcolor={ theme.palette.text.primary }
							     width="70%"
							     maxWidth="700px" />
						</React.Fragment>
					)) }
				</Paper>
			}
		</Box>
	);
}

export default TeacherRooms;


