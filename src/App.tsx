import React from 'react';
import { ThemeProvider } from "@mui/material";
import { theme } from './Theme/CustomTheme';
import { FacultyProvider } from "./components/FacultyContext";
import { QueryClient, QueryClientProvider } from "react-query";
import AppTree from "./AppTree";
import { AuthProvider } from "./components/AuthContext";

const queryClient = new QueryClient();

function App() {


	return (
		<ThemeProvider theme={ theme }>
			<QueryClientProvider client={ queryClient }>
				<AuthProvider>
					<AppTree />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

export default App;
