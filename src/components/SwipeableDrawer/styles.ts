import { Theme, SxProps } from "@mui/material";

export const mergeStylesWithTheme = (theme: Theme): SxProps => {
	return {
		"& .MuiDrawer-paper.MuiDrawer-paperAnchorLeft": {
			width: { sm: '25em', md: '30em', lg: '32em' },
			borderRadius: "0px 4% 40px 0px",
			padding: "2em 1em 1em 1em",
			backgroundColor: theme.palette.background.default,
		},
	};
};