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
import { useQuery } from "react-query";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SearchIcon from "@mui/icons-material/Search";
import { Teachers } from "./types";
import { useNavigate } from "react-router-dom";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import { replaceCzechChars } from "../FloorSelection";
import { searchTeacher } from "./apiCalls";
import { TextFieldStyles, DividerStyles } from "./styles";
import { useAuthContext } from "../../Contexts/AuthContext";
import { isFacultyType } from "../Topbar/Topbar";
import { useMapContext } from "../../Contexts/MapContext";

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
		setRoomData
	} = useFacultyContext();
	const { setDoesRoomExist } = useMapContext();

	const { isLoading, loginSuccess, loginError, updateLastUsed } = useAuthContext()

	const { refetch: refetchRoomInfo } = useQuery({
			queryKey: ['fetchRoomInfo', roomId],
			queryFn: () => fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/room/${ roomId }`).then(res => res.json()),
			enabled: false, // Initially, do not automatically run the query
		}
	);
	const { refetch, isRefetching, isLoading: isRefetchingLoading, isFetching } = useQuery({
			queryKey: ['searchTeacher', teacherName],
			queryFn: () => searchTeacher(teacherName),
			enabled: false, // Turn off automatic execution
			onSuccess: ({ data }) => {
				setTeachers(data.vysledky)
				updateLastUsed();
			},
		},
	);

// eslint-disable-next-line
	const debouncedSearch = useCallback(
		debounce((searchValue: string) => {
			if (searchValue && loginSuccess) {
				refetch(); // Assuming refetch uses searchTerm or teacherName state that's updated here
			}
		}, 500), // 500ms delay
		[loginSuccess]
	);
	useEffect(() => {
		debouncedSearch(teacherName);
	}, [teacherName, debouncedSearch]);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTeacherName(event.target.value);
	};
	const handleTeacherTabClick = async(roomId: number | null) => {
		if (roomId === null) {
			return;
		}
		await setRoomId(roomId);
		refetchRoomInfo().then(({ data }) => {
			setSelectedRoomId(roomId);
			if (isFacultyType(data.building_info.zkratka_prezentacni.split(' ')[0])) {
				const normalizedBuildingName = replaceCzechChars(data.building_info.nazev_prezentacni)!.replace(/\s/g, "_")
				setSelectedBuilding(data.building_info.nazev_prezentacni);
				setSelectedFaculty(data.building_info.zkratka_prezentacni.split(' ')[0]);
				const normalizedFloorName = replaceCzechChars(data.floor_info.nazev)!.replace(/\s/g, "_");
				setSelectedFloor(normalizedFloorName);
				setSelectedFloorNumber(data.floor_info.cislo);
				setDoesRoomExist(true);
				navigate(`/map/${ data.building_info.zkratka_prezentacni.split(' ')[0] }/${ normalizedBuildingName }/${ normalizedFloorName }/${ data.room_info.cislo }`)
			} else {
				setRoomData(data);
				setDoesRoomExist(false);
				setSelectedFaculty(undefined);
				navigate("/map")
			}
		});
	}

	if (loginError) {
		return <Typography>Failed to login. Try refreshing the page!</Typography>;
	}

	return (
		<Box height="100vh">
			<Paper sx={ { margin: "auto", maxWidth: "900px" } }>
				<TextField
					id="search-bar"
					className="text"
					label="Enter a teacher's name..."
					variant="filled"
					// placeholder="Search..."
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
								{ (isRefetchingLoading || isRefetching || isFetching) &&
									<CircularProgress sx={ { position: "fixed", right: 15 } }
													  size={ 30 }
													  thickness={ 5 } /> }
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
												{ mistnost }
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
												{ fakulta_zkratka }
											</Typography>
										</Box>
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


