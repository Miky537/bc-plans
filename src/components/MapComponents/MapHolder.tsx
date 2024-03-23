import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import { Room, Floor, Building } from "../parser/types";
import FloorHolder from "./FloorHolder";
import { SearchComponent } from "../SearchComponent/SearchComponent";
import { useFacultyContext } from "../FacultyContext";
import { SwipeableDrawerComponent } from "../SwipeableDrawer/SwipeableDrawerComponent";
import { CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";

export interface InfoState {
	room: Room | undefined;
	floor: Floor | undefined;
	building: Building | undefined;
}

const MapHolder = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [areFeaturesLoading, setAreFeaturesLoading] = useState(false);
	const { selectedFaculty } = useFacultyContext();

	const {
		selectedRoomId,
		setSelectedRoomId,
		handleRoomSelection,
		roomData,
		selectedFloorNumber,
		setSelectedFloorNumber
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

	return (
		<Box className="Map-Holder">
			<Box display={ areFeaturesLoading? "none" : "block" }>
				<SearchComponent setSelectedRoom={ setSelectedRoomId }
				                 setSelectedFloor={ setSelectedFloorNumber }
				                 setIsDrawerOpen={ setIsDrawerOpen } />
			</Box>

			<Box display={ areFeaturesLoading? "none" : "block" }>
				<FloorHolder />
			</Box>
			<MapComponent onRoomSelection={ handleRoomSelection }
			              selectedFloor={ selectedFloorNumber }
			              setIsDrawerOpen={ setIsDrawerOpen }
			              setAreFeaturesLoading={ setAreFeaturesLoading }
			/>
			<SwipeableDrawerComponent isDrawerOpen={ isDrawerOpen }
			                          onClose={ handleClose }
			                          onOpen={ handleOpen }
			                          roomData={ roomData } />
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
			     display={ areFeaturesLoading && selectedFaculty !== undefined ? "flex" : "none" }
			     borderRadius="20px"
			     justifyContent="space-around"
			     zIndex={ 100 }>
				<Typography>Loading..</Typography>
				<CircularProgress size={ 27 } thickness={ 5 } />
			</Box>
		</Box>
	);
};

export default MapHolder;
