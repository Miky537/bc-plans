import React from 'react';
import Box from "@mui/material/Box";
import { Topbar } from "../Topbar/Topbar";
import Content from "../Content/Context";
import { useNavigate } from "react-router-dom";
import { useMapContext } from "../MapComponents/MapContext";


interface MainProps {
	children: React.ReactNode;
	topBarTitle?: string;

}

export default function Main({children, topBarTitle}: MainProps) {
	const navigation = useNavigate();
	const { mapViewRef, setZoom } = useMapContext();
	const handleGoBack = () => {
		mapViewRef.current = null;
		setZoom(18)
		navigation('/faculty');
	}

	return (
		<Box display="flex" flexDirection="column" height="100vh">
			<Topbar title={topBarTitle} goBack={handleGoBack} />
			<Content>{ children }</Content>
		</Box>
	);
}
