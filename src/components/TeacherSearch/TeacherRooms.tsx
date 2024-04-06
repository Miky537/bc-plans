import React, { useEffect, useState, useCallback } from 'react';
import {
	Paper,
	TextField,
	Typography,
	InputAdornment,
	CircularProgress,
	debounce,
	useTheme,
	Button
} from "@mui/material";
import Box from "@mui/material/Box";
import { useQuery } from "react-query";
import SearchIcon from "@mui/icons-material/Search";
import { Teachers } from "./types";
import { useNavigate } from "react-router-dom";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import { replaceCzechChars } from "../FloorSelection";
import { searchTeacher } from "./apiCalls";
import { TextFieldStyles } from "./styles";
import { useAuthContext } from "../../Contexts/AuthContext";
import { isFacultyType } from "../Topbar/Topbar";
import { useMapContext } from "../../Contexts/MapContext";
import { RoomNames } from "../SearchComponent/SearchComponent";
import { FacultyType } from "../FacultySelection/FacultySelection";
import TeacherCard from "./TeacherCard";

interface TeacherRoomsInter extends RoomNames {
	email: string | null;
	fullTeacherName: string | null;
	teacherFaculty: string | null | FacultyType;
}

function TeacherRooms() {

	const [teacherName, setTeacherName] = useState('');
	const [teachers, setTeachers] = useState<Teachers[] | null>(null);
	const [roomId, setRoomId] = useState<number | null>(null);
	const [isWriting, setIsWriting] = useState(false);
	const [previouslySearchedTeachers, setPreviouslySearchedTeachers] = useState<TeacherRoomsInter[]>([]);
	const theme = useTheme();
	const navigate = useNavigate();
	const {
		setSelectedFloorNumber,
		setSelectedRoomId,
		setSelectedFaculty,
		setSelectedBuilding,
		setSelectedFloor,
		setRoomData,
		setAreFeaturesLoading,
		selectedFaculty,
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
				console.log(data);
				setTeachers(data.vysledky)
				updateLastUsed();
			},
		},
	);


	const checkTeacher = (room: TeacherRoomsInter) => {
		const previouslySearched = localStorage.getItem('TeacherSearch');
		const previouslySearchedRooms = previouslySearched? JSON.parse(previouslySearched) : [];

		// Check if the room is already in the array to avoid duplicates
		const existingIndex = previouslySearchedRooms.findIndex((existingRoom: TeacherRoomsInter) => existingRoom.room_id === room.room_id);

		let updatedRooms = [];

		if (existingIndex !== -1) {
			// If the room is already included, move it to the end to mark it as the most recent
			updatedRooms = [
				...previouslySearchedRooms.slice(0, existingIndex),
				...previouslySearchedRooms.slice(existingIndex + 1),
				room,
			];
		} else {
			// If the room is not included, add it
			updatedRooms = [...previouslySearchedRooms, room];
		}
		// Ensure only the last 3 items are kept
		if (updatedRooms.length > 7) {
			updatedRooms = updatedRooms.slice(-7);
		}
		// Save the updated array back to local storage
		localStorage.setItem('TeacherSearch', JSON.stringify(updatedRooms));
	}

	useEffect(() => {
		const fetchPreviouslySearched = () => {
			const storedRooms = localStorage.getItem('TeacherSearch');
			if (storedRooms) {
				setPreviouslySearchedTeachers(JSON.parse(storedRooms));
			}
		};
		fetchPreviouslySearched();
	}, []);


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
		const newValue = event.target.value;
		setIsWriting(newValue === ""? false : true);
		setTeacherName(event.target.value);
	};

	const handleTeacherTabClick = async(roomId: number | null, email: string | null,
	                                    fullTeacherName: string | null, teacherRoomName: string | null,
	                                    teacherFaculty: string | null | FacultyType) => {
		if (roomId === null) {
			return;
		}

		await setRoomId(roomId);
		refetchRoomInfo().then(({ data }) => {
			setSelectedRoomId(roomId);

			const template: TeacherRoomsInter = {
				room_id: roomId,
				room_name: teacherRoomName,
				floor_number: data.floor_info.cislo,
				faculty: data.building_info.zkratka_prezentacni.split(' ')[0] as FacultyType,
				email: email,
				fullTeacherName: fullTeacherName,
				teacherFaculty: teacherFaculty
			};
			checkTeacher(template);
			setAreFeaturesLoading(true);
			if (isFacultyType(teacherFaculty) || teacherFaculty === "CVIS") {
				const selFaculty = teacherFaculty === "CVIS"? "FP" : data.building_info.zkratka_prezentacni.split(' ')[0];
				const normalizedBuildingName = replaceCzechChars(data.building_info.nazev_prezentacni)!.replace(/\s/g, "_")
				setSelectedBuilding(data.building_info.nazev_prezentacni);
				setSelectedFaculty(data.building_info.zkratka_prezentacni.split(' ')[0]);

				setSelectedFaculty(selFaculty);
				const normalizedFloorName = replaceCzechChars(data.floor_info.nazev)!.replace(/\s/g, "_");
				setSelectedFloor(normalizedFloorName);
				setSelectedFloorNumber(data.floor_info.cislo);
				setDoesRoomExist(true);
				setIsWriting(false);
				navigate(`/map/${ selFaculty }/${ normalizedBuildingName }/${ normalizedFloorName }/${ data.room_info.cislo }`)
			} else {
				setSelectedFaculty(undefined);
				setRoomData(data);
				setDoesRoomExist(false);
				setIsWriting(false);
				navigate("/map")
			}
		});
	}
	const handleGoToMap = () => {
		if (selectedFaculty) {
			navigate(`/map/${ selectedFaculty }`);
		} else {
			navigate(`/map`);
		}
	}


	if (loginError) {
		return <Typography>Failed to login. Try refreshing the page!</Typography>;
	}

	return (
		<Box height="100vh">
			<Box sx={ { margin: "auto", maxWidth: "900px" } }>
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
									<CircularProgress sx={ { position: "absolute", right: 15 } }
													  size={ 30 }
													  thickness={ 5 } /> }
							</InputAdornment>
						),
					} }
				/>

				{ !isWriting?
					<>

						<Box display="flex" flexDirection="column" alignItems="center">
							<Typography alignSelf="flex-start" sx={ { pl: 1, color: "gray" } }>Previously
								searched:</Typography>
							{
								[...previouslySearchedTeachers].reverse().map(({
									                                               room_id,
									                                               room_name,
									                                               faculty,
									                                               floor_number,
									                                               email,
									                                               fullTeacherName,
									                                               teacherFaculty
								                                               }, index) => (
									<React.Fragment key={ index }>
										<TeacherCard isSearchedItem
										             fullTeacherName={ fullTeacherName }
										             email={ email }
										             faculty={ teacherFaculty }
										             room_name={ room_name }
										             room_id={ room_id }
										             handleTeacherTabClick={ handleTeacherTabClick }
										/>
									</React.Fragment>
								))
							}
						</Box>
					</>
					:
					null
				}

				{
					teacherName === '' || isLoading? null :
						isLoading && !loginSuccess? (
							<Box display="flex" width="100%" height="30em" justifyContent="center" alignItems="center">
								<CircularProgress size={ 100 } thickness={ 5 } />
							</Box>
						) : (
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
										<TeacherCard isSearchedItem={ false }
										             fullTeacherName={ label }
										             email={ email }
										             faculty={ fakulta_zkratka as FacultyType }
										             room_name={ mistnost }
										             room_id={ mistnost_id as number }
										             handleTeacherTabClick={ handleTeacherTabClick }
										/>
									</React.Fragment>
								)) }
							</Paper>
						)
				}
				<Button variant="contained"
				        onClick={ handleGoToMap }
				        sx={ {
					        position: "fixed",
					        bottom: 0,
					        left: "50%",
					        transform: 'translateX(-50%)',
					        width: "100%",
					        maxWidth: "1440px",
					        height: "5em"
				        } }>
					<Typography variant="h5" sx={ {
						display: "flex",
						alignItems: "center"
					} }
					>Go to map</Typography>
				</Button>
			</Box>
		</Box>
	);
}

export default TeacherRooms;


