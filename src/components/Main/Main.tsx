import React from 'react';
import Box from "@mui/material/Box";
import { Topbar } from "../Topbar/Topbar";
import Content from "../Content/Context";


interface MainProps {
	children: React.ReactNode;
	topBarTitle?: string;
}

export default function Main({children, topBarTitle}: MainProps) {
	return (
		<Box display="flex" flexDirection="column" height="100vh">
			<Topbar title={topBarTitle}/>
			<Content>{ children }</Content>
		</Box>
	);
}
