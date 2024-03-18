export interface TopbarProps {
	title?: string;
	goBack?: () => void;
	disabled?: boolean;
}

export type FacultyIcons = {
	[key: string]: React.ReactElement;
};

export const Faculties = ["FIT", "FAST", "FSI", "FEKT", "FAVU", "FCH", "USI", "FP", "FA", "CESA"];
