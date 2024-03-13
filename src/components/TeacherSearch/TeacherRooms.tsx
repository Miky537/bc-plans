import React, { useEffect, useState, useCallback } from 'react';
import { Paper, TextField, Typography, Divider, InputAdornment, CircularProgress, debounce } from "@mui/material";
import Box from "@mui/material/Box";
import { useMutation, useQuery } from "react-query";
import { serverAddress } from "../../config";
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
		() => fetch(`${ serverAddress }/api/room/${ roomId }`).then(res => res.json()), // Ensure you return the result of res.json()
		{
			enabled: false, // Initially, do not automatically run the query
		}
	);
	const { refetch } = useQuery({
			queryKey: ['searchTeacher', teacherName],
			queryFn: () => searchTeacher(teacherName),
			enabled: false, // Turn off automatic execution
			onSuccess: ({data}) => {
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
			// console.log('Session token:', data.http_session_token);
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

		// Cleanup function to cancel the debounce if the component unmounts or if searchTerm changes again before the debounce executes
		// return () => debouncedSearch.cancel();
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
			console.log('Room data:', data);
			setSelectedRoomId(roomId);
			setSelectedFaculty(data.building_info.zkratka_prezentacni.split(' ')[0]);
			const normalizedBuildingName = replaceCzechChars(data.building_info.nazev_prezentacni)!.replace(/\s/g, "_")
			setSelectedBuilding(data.building_info.nazev_prezentacni);
			console.log('Selected building:', normalizedBuildingName);
			const normalizedFloorName = replaceCzechChars(data.floor_info.nazev)!.replace(/\s/g, "_");
			setSelectedFloor(normalizedFloorName);
			setSelectedFloorNumber(data.floor_info.cislo);
			navigate(`/${ data.building_info.zkratka_prezentacni.split(' ')[0] }/${ normalizedBuildingName }/${ normalizedFloorName }/${ data.room_info.cislo }`);
		});
	}

	if (loginError) {
		return <div>Failed to login: { loginError.toString() }</div>;
	}

	// if (!loginSuccess) {
	// 	return <div>Logging in...</div>;
	// }


	return (
		<>
			<Paper square>
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
					sx={ TextFieldStyles }
					disabled={ isLoading }
					InputProps={ {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon color="primary" />
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
					height: "100%",
					width: "100%",
					display: "flex",
					alignItems: "center",
					flexDirection: "column"
				} } square>

					{ teachers?.map(({ label, mistnost, mistnost_id, email, fakulta_zkratka }, index) => (
						<React.Fragment key={ index }>
							<Box width="90%"
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
								     width="80%"
								     margin="auto"
								>
									<Typography variant="body2" sx={ { pl: 0 } }>
										{ mistnost }
									</Typography>
									<Divider flexItem orientation="vertical" sx={ DividerStyles } />
									<Typography variant="body2" sx={ { pl: 0 } }>
										{ email }
									</Typography>
									<Divider flexItem orientation="vertical" sx={ DividerStyles } />
									<Typography variant="body2" sx={ { pl: 0 } }>
										{ fakulta_zkratka }
									</Typography>

								</Box>
							</Box>
							<Divider flexItem
							         variant="middle"
							         sx={ DividerStyles } />
						</React.Fragment>
					)) }
				</Paper>
			}
		</>
	);
}

export default TeacherRooms;


