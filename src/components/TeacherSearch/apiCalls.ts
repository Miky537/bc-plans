export const login = async() => {
	const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error('Authentication failed');
	}
	startTokenRefreshTimer();
	const data = await response.json();
	return data;
};

const startTokenRefreshTimer = () => {
	// Set timer for 19 minutes before token expiration (1140 seconds)
	setTimeout(() => {
		login(); // Refresh the token by logging in again
	}, 1140 * 1000);
};

export const searchTeacher = async(name: string) => {
	const token = sessionStorage.getItem('sessionToken');
	const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/search/teacher/${ name }`, {
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

export const getRoomPhoto = async(roomId: number) => {
	const token = sessionStorage.getItem('sessionToken');
	const headers: HeadersInit = {};
	if (token) {
		headers['Authorization'] = token;
	} else {
		return "";
	}
	const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/photo/${ roomId }`, {
		method: 'GET',
		headers: headers,
	});

	if (!response.ok) {
		throw new Error('Failed to fetch photo');
	}
	if (response.status === 204) {
		return "";
	}
	// Convert the response to a blob if you're working with binary data
	const imageBlob = await response.blob();

	// Create a local URL for the blob to be used in an <img> element
	const imageObjectURL = URL.createObjectURL(imageBlob);
	// console.log("imageObjectURL", imageObjectURL)
	return imageObjectURL;
};