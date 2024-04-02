import React from 'react';
import { ThemeProvider } from "@mui/material";
import { theme } from './Theme/CustomTheme';
import { QueryClient, QueryClientProvider } from "react-query";
import AppTree from "./AppTree";
import { AuthProvider } from "./Contexts/AuthContext";

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
