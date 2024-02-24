import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import Main from "./Main/Main";
import { serverAddress } from "../config";
import { Typography } from "@mui/material";
import { useFacultyContext } from "./FacultyContext";
import { Floor } from "./parser/types";
import BuildingSelection from "./BuildingSelection";


function FloorSelection() {
	const [floors, setFloors] = useState([]);
	const { selectedBuildingId, setSelectedBuildingId } = useFacultyContext();

	useEffect(() => {
		const url = `${ serverAddress }/api/floors/FIT/${ selectedBuildingId }`;

		// Fetch buildings data from the API
		fetch(url)
			.then(response => {
				console.log("response", response);
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${ response.status }`);
				}

				return response.json();

			})
			.then(data => setFloors(data))
			.catch(error => console.log("Fetching floors failed: ", error));
	}, [selectedBuildingId]);

	return (
		<Main>
			<Box display="flex" flexDirection="column" justifyContent="flex-start" height="100%" width="100%"
			     pt={ 4 } pb={ 4 } bgcolor="#323232" color="white">
				{ floors.length > 0? ( //first sort the buildings by name, then map them to a list
					floors.sort((a: Floor, b: Floor) => b.nazev.localeCompare(a.nazev))
						.map((floor: Floor, index) => (
							<Box key={ floor.nazev }
							     width="100%"
							     pt="0.7em"
							     pb="0.7em"
							     pl="0.7em"
							     bgcolor={ index % 2? "black" : "grey" }>
								<Typography variant="h5">{ floor.nazev }</Typography>
							</Box>
						))
				) : (
					<Typography>No buildings found for the selected faculty.</Typography>
				) }
			</Box>
		</Main>
	);
}

export default FloorSelection;
