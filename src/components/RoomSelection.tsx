import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import { Typography } from "@mui/material";

interface FloorSelection {
	name: string;
	address: string;
	building_id: number;
}

function RoomSelection() {
	const [buildings, setBuildings] = useState([]);

	useEffect(() => {
		const url = `${ serverAddress }/api/floors/FIT/`;

		// Fetch buildings data from the API
		fetch(url)
			.then(response => {
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${ response.status }`);
				}

				return response.json();

			})
			.then(data => setBuildings(data))
			.catch(error => console.log("Fetching buildings failed: ", error));
	}, []);

	return (
		<Main>
			<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white">
				{ buildings.length > 0? ( //first sort the buildings by name, then map them to a list
					buildings.sort((a: FloorSelection, b: FloorSelection) => a.name.localeCompare(b.name))
						.map((building: FloorSelection, index) => (
							<Box key={ building.name }
							     width="100%"
							     pt="0.7em"
							     pb="0.7em"
							     pl="0.7em"
							     bgcolor={ index % 2? "black" : "grey" }>
								<Typography variant="h5">{ building.name }</Typography>
							</Box>
						))
				) : (
					<Typography>No buildings found for the selected faculty.</Typography>
				) }
			</Box>
		</Main>
	);
}

export default RoomSelection;
