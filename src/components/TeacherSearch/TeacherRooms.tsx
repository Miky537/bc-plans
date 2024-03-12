import React, { useEffect, useState } from 'react';
import { Paper, TextField, Typography, Divider, InputAdornment } from "@mui/material";
import Box from "@mui/material/Box";
import { useMutation, useQuery } from "react-query";
import { serverAddress } from "../../config";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SearchIcon from "@mui/icons-material/Search";
import { Teachers, AuthType } from "./types";

const TextFieldStyles = {
	"& .MuiInputBase-root.MuiFilledInput-root.MuiFilledInput-underline:before": {
		borderBottom: "2px solid rgba(200, 200, 200, 0.42)",
	}
}


const login = async() => {
	const response = await fetch(`${ serverAddress }/api/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		console.log(response);
		throw new Error('Authentication failed');
	}

	const data = await response.json();
	return data;
};

const searchTeacher = async(name: any) => {
	const token = sessionStorage.getItem('sessionToken');
	const response = await fetch(`${ serverAddress }/api/search/teacher/${ name }`, {
		method: 'GET',
		headers: {
			'Authorization': `${ token }`,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Search failed');
	}

	return await response.json();
};

function TeacherRooms() {

	const [teacherName, setTeacherName] = useState('');
	const [teachers, setTeachers] = useState<Teachers[] | null>(null);


	const { data: teacherData, refetch } = useQuery({
			queryKey: ['searchTeacher', teacherName],
			queryFn: () => searchTeacher(teacherName),
			enabled: false, // Turn off automatic execution
			onSuccess: ({data}) => {
				setTeachers(data.vysledky)
				console.log('Search Successful', data.vysledky);
			},
		},
	);

	const { mutate: loginMutate, data: loginData, error: loginError, isSuccess: loginSuccess } = useMutation(login, {
		onSuccess: (data: AuthType) => {
			const sessionToken = data.http_session_token;
			sessionStorage.setItem('sessionToken', data.http_session_token);
			// console.log('Session token:', data.http_session_token);
		},
		onError: (error) => {
			console.error('Login Error', error);
		},
	});
	useEffect(() => {
		if (teacherName && loginSuccess) {
			refetch(); // Only search if there's a name to search for and the user is authenticated
		}
	}, [teacherName, loginSuccess, refetch]);

	const handleInputChange = (event: any) => {
		setTeacherName(event.target.value);
	};


	useEffect(() => {
		loginMutate(); // Trigger login on component mount
	}, []);

	if (loginError) {
		return <div>Failed to login: { loginError.toString() }</div>;
	}

	if (!loginSuccess) {
		return <div>Logging in...</div>;
	}


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
					InputProps={ {
						startAdornment: (
							<InputAdornment position="start">
								<SearchIcon color="primary" />
							</InputAdornment>
						),
					} }
				/>
			</Paper>
			<Paper sx={ {
				height: "100%",
				width: "100%",
				display: "flex",
				alignItems: "center",
				flexDirection: "column"
			} } square>

				{ teachers?.map((teacher, index) => (
					<React.Fragment key={ index }>
						<Box width="90%"
						     display="flex"
						     alignItems="center"
						     gap={ 1.5 }
						     py={ 1.5 }
						     m={ 1 }
						     bgcolor="#222831"
						     borderRadius="10px">
							<AccountBoxIcon sx={ { pl: 2 } } />
							<Typography variant="h6">
								{ teacher.label }
							</Typography>
						</Box>
						<Divider flexItem
						         variant="middle"
						         sx={ { opacity: 0.5, borderColor: "#FFFFFF", ml: "4em", mr: "4em" } } />
					</React.Fragment>
				)) }

			</Paper>

		</>
	);
}

export default TeacherRooms;


