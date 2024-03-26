import React, { useState, useRef, useEffect, useCallback } from 'react';
import MapComponent from './MapComponent';
import { Room, Floor, Building } from "../parser/types";
import FloorHolder from "./FloorHolder";
import { SearchComponent } from "../SearchComponent/SearchComponent";
import { useFacultyContext } from "../FacultyContext";
import { SwipeableDrawerComponent } from "../SwipeableDrawer/SwipeableDrawerComponent";
import { CircularProgress, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useMapContext } from "./MapContext";

export interface InfoState {
	room: Room | undefined;
	floor: Floor | undefined;
	building: Building | undefined;
}

const MapHolder = () => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [areFeaturesLoading, setAreFeaturesLoading] = useState(false);
	const [allFeatures, setAllFeatures] = useState<any>([]);
	const [areFeaturesEmpty, setAreFeaturesEmpty] = useState(false);
	const { selectedFaculty } = useFacultyContext();
	const { arePinsVisible } = useMapContext();

	const {
		selectedRoomId,
		setSelectedRoomId,
		roomData,
		selectedFloorNumber,
		setSelectedFloorNumber,
	} = useFacultyContext();
	const selectedRoomIdRef = useRef(selectedRoomId);

	console.log("sss", areFeaturesLoading, (areFeaturesEmpty && !areFeaturesLoading), arePinsVisible)
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
			<Box display={ areFeaturesLoading || (areFeaturesEmpty && !areFeaturesLoading) || arePinsVisible ? "none" : "block" }>
				<SearchComponent setSelectedRoom={ setSelectedRoomId }
				                 setSelectedFloor={ setSelectedFloorNumber }
				                 setIsDrawerOpen={ setIsDrawerOpen } />
			</Box>

			<Box display={ areFeaturesLoading || (areFeaturesEmpty && !areFeaturesLoading) || arePinsVisible ? "none" : "block" }>
				<FloorHolder />
			</Box>
			<MapComponent isDrawerOpen={ isDrawerOpen }
				selectedFloor={ selectedFloorNumber }
			              setIsDrawerOpen={ setIsDrawerOpen }
			              setAreFeaturesLoading={ setAreFeaturesLoading }
			              allFeatures={ allFeatures }
			              setAllFeatures={ setAllFeatures }
			              setAreFeaturesEmpty={ setAreFeaturesEmpty }
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
			     display={ areFeaturesLoading && selectedFaculty !== undefined? "flex" : "none" }
			     borderRadius="20px"
			     justifyContent="space-around"
			     zIndex={ 100 }>
				<Typography>Loading..</Typography>
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
			     display={ areFeaturesEmpty && selectedFaculty !== undefined && !areFeaturesLoading ? "flex" : "none" }
			     borderRadius="20px"
			     justifyContent="space-around"
			     zIndex={ 100 }>
				<Typography>Faculty is yet to be added!</Typography>
			</Box>
		</Box>
	);
};

export default MapHolder;
