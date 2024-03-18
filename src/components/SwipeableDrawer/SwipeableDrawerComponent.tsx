import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import React, { useState, useEffect } from "react";
import { useTheme, SxProps, Theme, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { RoomDetails } from "../MapComponents/tempFile";
import { getRoomPhoto } from "../TeacherSearch/apiCalls";
import { useFacultyContext } from "../FacultyContext";


interface SwipeableDrawerComponentProps {
	isDrawerOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
	roomData: RoomDetails;
}

const mergeStylesWithTheme = (theme: Theme): SxProps => {
	return {
		"& .MuiDrawer-paper.MuiDrawer-paperAnchorBottom": {
			height: "30%",
			borderRadius: "40px 40px 0px 0px",
			padding: "2em 1em 1em 1em",
			backgroundColor: theme.palette.background.default,
		},
	};
};


export function SwipeableDrawerComponent({
	                                         isDrawerOpen,
	                                         onClose,
	                                         onOpen,
	                                         roomData
                                         }: SwipeableDrawerComponentProps) {
	const { room_info, floor_info, areal_info, building_info } = roomData;
	const [isImageZoomed, setIsImageZoomed] = useState(false);
	const nazev = room_info?.nazev;
	const mistnostid = room_info?.mistnost_id;
	const podlazi_id = floor_info?.podlazi_id;
	const roomType = room_info?.mistnost_typ_id;
	const label = room_info?.label;
	const areal_name = areal_info?.nazev_puvodni;
	const { selectedRoomId } = useFacultyContext()
	const [photoUrl, setPhoto] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const theme = useTheme();

	// const { data: photoUrl, isError, isLoading, isFetching, error } = useQuery(
	// 	['roomPhoto', selectedRoomId],
	// 	() => getRoomPhoto(selectedRoomId),
	// 	{
	// 		enabled: !!selectedRoomId, // Only run if selectedRoomId is not nully
	// 	}
	// );


	useEffect(() => {
		setIsError(false);
		setIsLoading(true);
		setPhoto("");
		if (!selectedRoomId) {
			return;
		}
		getRoomPhoto(selectedRoomId)
			.then((url: any) => {
				if (url === "") {
					setIsError(true);
					setIsLoading(false);
				}
				setPhoto(url);
				setIsLoading(false);
			})
			.catch((error: any) => {
				console.error('Failed to load image:', error)
				setIsError(true);
				setIsLoading(false);
			});
	}, [selectedRoomId]);

	const handleImageClick = () => {
		setIsImageZoomed(!isImageZoomed);
	};

	return (
		<SwipeableDrawer
			anchor="bottom"
			open={ isDrawerOpen }
			onClose={ onClose }
			onOpen={ onOpen }
			sx={ mergeStylesWithTheme(theme) }
		>
			<Box position="absolute"
			     top="1em"
			     left="25%"
			     borderTop="5px solid #ABABAB"
			     height="1px"
			     width="50%"
			     display="flex"></Box>
			<Box display="flex" gap={ 2 }>
				{ isLoading || isError? <Box sx={ {
					display: 'flex',
					color: 'black',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '10px',
					bgcolor: 'grey.300',
					width: '55%',
					maxWidth: '55%',
					height: '100%',
					maxHeight: '45vh',
					cursor: 'pointer',
				} }>{ isError? "No photo yet" : "Loading.." }</Box> : <Box
					component="img"
					src={ photoUrl }
					alt="Detailed View"
					sx={ {
						borderRadius: '10px',
						maxWidth: isImageZoomed? '100%' : '55%',
						maxHeight: isImageZoomed? '90vh' : '45vh',
						cursor: 'pointer',
						transition: 'max-width 0.3s ease-in-out, max-height 0.3s ease-in-out',
					} }
					onClick={ handleImageClick }
				/> }

				<Box sx={ {
					opacity: isImageZoomed? 0 : 1,
					display: isImageZoomed? 'none' : 'block',
					cursor: 'pointer',
					transition: 'opacity 0.05s ease-in-out, display 0.05s ease-in-out',
				} }>
					<Typography variant="h6">Room: { room_info.cislo }</Typography>
					<Typography variant="h6">Floor: { floor_info.cislo }</Typography>
					<Typography variant="h6">Building: { building_info.zkratka_prezentacni }</Typography>
				</Box>
			</Box>


			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">name:</Typography><Typography variant="h6">{ nazev }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">popis:</Typography><Typography variant="h6">{ room_info.popis }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">podlazi_id:</Typography><Typography variant="h6">{ podlazi_id }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">label:</Typography><Typography variant="h6">{ label }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">Areal
				name:</Typography><Typography variant="h6">{ areal_name }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">Room
				Id:</Typography><Typography variant="h6">{ mistnostid }</Typography></Box>
			<Box display="flex"><Typography flexGrow="1"
			                                variant="h6">roomType</Typography><Typography variant="h6">{ roomType }</Typography></Box>
		</SwipeableDrawer>
	)
}
