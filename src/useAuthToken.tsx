import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { login } from "./components/TeacherSearch/apiCalls";
import { AuthType } from "./components/TeacherSearch/types";
import { useAuthContext } from "./components/AuthContext";

const useAuthToken = () => {

	const { updateLastUsed, lastUpdated, setLoginSuccess, setLoginError, setIsLoading } = useAuthContext();

	const {
		mutate: loginMutate,
		data: authData,
		error: loginError,
		isSuccess: loginSuccess,
		isLoading,
	} = useMutation(login, {
		onSuccess: (data: AuthType) => {
			const sessionToken = data.http_session_token;
			sessionStorage.setItem('sessionToken', sessionToken);
			updateLastUsed();
			setLoginSuccess(true);
			setIsLoading(false);
		},
		onError: (error) => {
			setLoginError(error as Error);
			console.error('Login Error', error);
			setIsLoading(false);
		},
	});

	useEffect(() => {
		setIsLoading(isLoading);
	}, [isLoading, setIsLoading]);

	// Check the need for token refresh based on last used time
	useEffect(() => {
		const checkTokenRefresh = () => {
			if (lastUpdated) {
				const now = new Date();
				const timeSinceLastUsed = now.getTime() - lastUpdated.getTime();
				// 20 minutes
				const refreshThreshold = 20 * 60 * 1000;

				if (timeSinceLastUsed >= refreshThreshold) {
					loginMutate();
				}
			}
		};

		const interval = setInterval(checkTokenRefresh, 5 * 60 * 1000); // Check every 5 minutes
		return () => clearInterval(interval);
	}, [lastUpdated, loginMutate]);

	return { loginMutate, updateLastUsed, loginError, loginSuccess, isLoading, authData };
};

export default useAuthToken;
