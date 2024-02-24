import React, { createContext, useContext, useState } from 'react';

interface FacultyType {
	selectedBuildingId: number | null;
	setSelectedBuildingId: (id: number | null) => void;
}

const FacultyContext = createContext<FacultyType | undefined>(undefined);

export const useFacultyContext = () => {
	const context = useContext(FacultyContext);
	if (context === undefined) {
		throw new Error('useBuildingContext must be used within a FacultyProvider');
	}
	return context;
}

export const FacultyProvider = ({ children }: { children: React.ReactNode }) => {
	// Initialize with a number; use 0 or another appropriate default value
	const [selectedBuildingId, setSelectedBuildingId] = useState<number | null>(null);

	return (
		<FacultyContext.Provider value={{ selectedBuildingId, setSelectedBuildingId }}>
			{children}
		</FacultyContext.Provider>
	);
};