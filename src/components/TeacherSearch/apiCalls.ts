import { serverAddress } from "../../config";

export const login = async() => {
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

export const searchTeacher = async(name: any) => {
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