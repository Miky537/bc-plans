import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import { Room, Floor, Building } from "./types";
import FloorHolder from "./FloorHolder";
import { SearchComponent } from "../SearchComponent/SearchComponent";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import { SwipeableDrawerComponent } from "../Drawer/SwipeableDrawerComponent";
import { CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useMapContext } from "../../Contexts/MapContext";
import MediaQuery from "react-responsive";
import { DesktopDrawer } from "../Drawer/DesktopDrawer";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import BusinessIcon from '@mui/icons-material/Business';
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export interface InfoState {
	room: Room | undefined;
	floor: Floor | undefined;
	building: Building | undefined;
}

const boxStyles = {
	position: "absolute",
	left: "0.5em",
	top: "10em",
	width: "3em",
	height: "3em",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	zIndex: 1,
	bgcolor: "background.paper",
	borderRadius: "50%",
}

const MapHolder = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [allFeatures, setAllFeatures] = useState<any>([]);
	const [areFeaturesEmpty, setAreFeaturesEmpty] = useState(false);
	const { selectedFaculty, setAreFeaturesLoading, areFeaturesLoading } = useFacultyContext();
	const { arePinsVisible } = useMapContext();
	const navigate = useNavigate()
	const {
		selectedRoomId,
		setSelectedRoomId,
		roomData,
		selectedFloorNumber,
		setSelectedFloorNumber,
	} = useFacultyContext();
	const selectedRoomIdRef = useRef(selectedRoomId);

	const handleOpen = useCallback(() => {
		setIsDrawerOpen(true);
	}, [setIsDrawerOpen]);

	const handleClose = useCallback(() => {
		setIsDrawerOpen(false);
	}, [setIsDrawerOpen]);

	useEffect(() => {
		selectedRoomIdRef.current = selectedRoomId;
	}, [selectedRoomId]);

	const handleTeacherSearchClick = () => {
		navigate("/teacher")
	}
	const handleBuildingIconClick = () => {
		navigate("/faculty")
	}

	return (
		<Box className="Map-Holder">

			<SearchComponent setSelectedRoom={ setSelectedRoomId }
			                 setSelectedFloor={ setSelectedFloorNumber }
			                 setIsDrawerOpen={ setIsDrawerOpen }
			                 setAreFeaturesLoading={ setAreFeaturesLoading }
			/>

			<Box sx={{...boxStyles, top: "8em"}}>
				<IconButton sx={ { color: "white", padding: 0 } } onClick={handleTeacherSearchClick}>
					<PersonSearchIcon fontSize="large" />
				</IconButton>
			</Box>

			<Box sx={{...boxStyles, top: "12em"}}>
				<IconButton sx={ { color: "white", padding: 0 } } onClick={handleBuildingIconClick}>
					<BusinessIcon fontSize="large" />
				</IconButton>
			</Box>

			<Box display={ areFeaturesLoading || (areFeaturesEmpty && !areFeaturesLoading) || arePinsVisible? "none" : "block" }>
				<FloorHolder />
			</Box>
			<MapComponent isDrawerOpen={ isDrawerOpen }
			              selectedFloor={ selectedFloorNumber }
			              setIsDrawerOpen={ setIsDrawerOpen }
			              setAreFeaturesLoading={ setAreFeaturesLoading }
			              areFeaturesLoading={ areFeaturesLoading }
			              allFeatures={ allFeatures }
			              setAllFeatures={ setAllFeatures }
			              setAreFeaturesEmpty={ setAreFeaturesEmpty }
			/>
			<MediaQuery maxWidth={ 600 }>
				<SwipeableDrawerComponent isDrawerOpen={ isDrawerOpen }
				                          onClose={ handleClose }
				                          onOpen={ handleOpen }
				                          roomData={ roomData } />
			</MediaQuery>
			<MediaQuery minWidth={ 600 }>
				<DesktopDrawer isDrawerOpen={ isDrawerOpen }
				               onClose={ handleClose }
				               onOpen={ handleOpen }
				               roomData={ roomData } />
			</MediaQuery>

			<Box width="35%"
			     maxWidth="10em"
			     position="absolute"
			     top="4em"
			     right={ 0 }
			     boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
			     left={ 0 }
			     marginLeft="auto"
			     marginRight="auto"
			     bgcolor="background.paper"
			     color="white"
			     px="1em"
			     py="0.3em"
			     display={ areFeaturesLoading && selectedFaculty !== undefined? "flex" : "none" }
			     borderRadius="20px"
			     justifyContent="space-around"
			     zIndex={ 0 }>
				<Typography>Načítání..</Typography>
				<CircularProgress size={ 27 } thickness={ 5 } />
			</Box>
			<Box width="60%"
			     maxWidth="20em"
			     position="absolute"
			     top="4em"
			     right={ 0 }
			     boxShadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
			     left={ 0 }
			     marginLeft="auto"
			     marginRight="auto"
			     bgcolor="background.paper"
			     color="white"
			     px="1em"
			     py="0.3em"
			     display={ areFeaturesEmpty && selectedFaculty !== undefined && !areFeaturesLoading? "flex" : "none" }
			     borderRadius="20px"
			     justifyContent="space-around"
			     zIndex={ 100 }>
				<Typography>Fakulta ještě není přidána!</Typography>
			</Box>
		</Box>
	);
};

export default MapHolder;
