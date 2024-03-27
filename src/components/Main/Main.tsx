import React from 'react';
import Box from "@mui/material/Box";
import { Topbar } from "../Topbar/Topbar";
import Content from "../Content/Context";
import { useNavigate } from "react-router-dom";
import { useMapContext } from "../MapComponents/MapContext";


interface MainProps {
	children: React.ReactNode;
	topBarTitle?: string;
	topBarSelectedDisabled?: boolean;
}

export default function Main({children, topBarTitle, topBarSelectedDisabled}: MainProps) {
	const navigation = useNavigate();
	const { mapViewRef, setZoom } = useMapContext();
	const handleGoBack = () => {
		mapViewRef.current = null;
		setZoom(18)
		navigation('/faculty');
	}

	return (
		<Box display="flex" flexDirection="column" height="100dvh" bgcolor="background.paper" position="relative">
			<Topbar title={topBarTitle} goBack={handleGoBack} disabled={topBarSelectedDisabled} />
			<Content>{ children }</Content>
		</Box>
	);
}
