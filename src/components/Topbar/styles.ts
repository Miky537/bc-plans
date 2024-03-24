import { Theme } from '@mui/material/styles';
export const FormControlLabelStyles = {
	"& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl": {
		top: "-18% !important",
	},
	"& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl.Mui-focused": {
		opacity: 0,
	},
	"& .MuiFormLabel-root.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-sizeMedium.MuiInputLabel-outlined.MuiFormLabel-colorPrimary.MuiFormLabel-filled.MuiInputLabel-root.MuiInputLabel-formControl.MuiInputLabel-animated.MuiInputLabel-shrink.MuiInputLabel-sizeMedium.MuiInputLabel-outlined": {
		opacity: 0,
	},
}


export const SelectStyles = ({palette}: Theme) => ({
	"&": {
		display: "flex",
	},

	"&.faculty-select-topbar .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input": {
		paddingRight: "0em",
	},
	"&.faculty-select-topbar .MuiSvgIcon-root.Mui-disabled": {
		color: palette.text.disabled
	},
	"&.faculty-select-topbar .MuiSelect-select svg": {
		height: "2em",
		width: "7em",
		padding: 0,
		display: "flex",
		paddingTop: "0.2em",
		paddingBottom: "0.2em",
	},

	"&.faculty-select-topbar .MuiSelect-select": {
		height: "2.5em",
		width: "10em",
		maxWidth: "10em",
		padding: 0,

	},
	"&.faculty-select-topbar .MuiSvgIcon-root": {
		width: "1em",
		height: "1em",
		color: "white",
	},
})

export const svgStyle = {
	paddingLeft: "0.5em",
	width: "fit-content",
	height: "34px",
}