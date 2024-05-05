import { Accordion, AccordionSummary, Typography, AccordionDetails, useTheme, Theme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import RoomItem from "./RoomSelectionItem";
import React, { useCallback } from "react";
import { FetchedFloor, replaceCzechChars, FetchedFloorRoomType } from "./FloorSelection";
import { useFacultyContext } from "../../../Contexts/FacultyContext";
import { useNavigate, useParams } from "react-router-dom";

const accordionStyles = (theme: Theme) => ({
	borderBottom: "1px solid gray !important",
	'& .MuiAccordionSummary-expandIconWrapper': {
		color: theme.palette.text.primary,
	}
});


interface FloorSelItemProps {
	floor: FetchedFloor;
	expanded: string | false;
	setExpanded: (value: string | false) => void;
	handleRoomClick: (roomName: string | null, roomId: number) => Promise<void>;
}

export default function FloorSelItem({ floor, setExpanded, expanded, handleRoomClick }: FloorSelItemProps) {
	const theme = useTheme();
	const navigate = useNavigate();
	const { building } = useParams();

	const { selectedFaculty, setSelectedFloor } = useFacultyContext();

	const handleChange = useCallback(
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setExpanded(isExpanded? panel : false);
			setSelectedFloor(isExpanded? panel : undefined);
			const selectedFloorLocal = replaceCzechChars(panel)!.replace(/\s/g, "_");
			if (panel && isExpanded) {
				navigate(`/${ selectedFaculty }/${ building }/${ selectedFloorLocal }`, { replace: true });
			} else {
				navigate(`/${ selectedFaculty }/${ building }`, { replace: true });
			}
		},
		[navigate, selectedFaculty, building]
	);

	return (
		<Accordion key={ floor.floor_id }
		           expanded={ expanded === floor.floor_name }
		           onChange={ handleChange(floor.floor_name) }
		           sx={ accordionStyles(theme) }
		           disableGutters
		>
			<AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
				<Typography variant="h5">{ floor.floor_name }</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Box>
					{
						floor.rooms!.sort((a: FetchedFloorRoomType, b: FetchedFloorRoomType) => {
							// Use localeCompare to sort strings lexicographically
							return (a.room_number || "").localeCompare(b.room_number || "");
						}).map((room: FetchedFloorRoomType) => {
							return (
								<Box key={ room.room_id }>
									<RoomItem
										handleRoomClick={ handleRoomClick }
										buildingName={ floor.building_name }
										floorName={ floor.floor_name }
										roomName={ room.room_number }
										roomId={ room.room_id }
										floorNumber={ floor.floor_number }
										fullRoomName={room.name}
									/>
								</Box>
							);
						})
					}
				</Box>

			</AccordionDetails>
		</Accordion>
	)
}