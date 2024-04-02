import React, { createContext, useContext, useState } from 'react';

interface AuthTypeContext {
	lastUpdated: Date | null,
	updateLastUsed: () => void,

	loginError: Error | null;
	loginSuccess: boolean;
	isLoading: boolean;
	setLoginError: (error: Error | null) => void;
	setLoginSuccess: (success: boolean) => void;
	setIsLoading: (loading: boolean) => void;
}

const AuthContext = createContext<AuthTypeContext | undefined>(undefined);

export const useAuthContext = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('Error withing AuthContext!');
	}
	return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
	const [loginError, setLoginError] = useState<Error | null>(null);
	const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const updateLastUsed = () => {
		setLastUpdated(new Date());
	};

	return (
		<AuthContext.Provider value={ {
			lastUpdated,
			updateLastUsed,
			loginError,
			loginSuccess,
			isLoading,
			setLoginError,
			setLoginSuccess,
			setIsLoading,
		} }>
			{ children }
		</AuthContext.Provider>
	);
};