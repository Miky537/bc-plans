export const searchBoxStyle = {
	display: "flex",
	override: "hidden",
	overflow: "hidden",
	alignItems: "center",
	padding: "10px",
	color: "white",
	gap: 1,
	flexDirection: "row",
	cursor: "pointer",
}
export const InputBaseStyle = {
	color: "white",
	zIndex: "1000",
	width: "100%",
	'.MuiInputBase-input': {
		padding: "10px 0",
		pl: "1em",
	},
}

export const SearchBoxContainer = (isExpanded: boolean) => ({
		width: isExpanded? "95%" : "3em",
		maxWidth: "40em",
		height: "3em",
		bgcolor: "background.paper",
		borderRadius: isExpanded? "10px" : "50%",
		borderBottomLeftRadius: isExpanded? "0" : "50%",
		borderBottomRightRadius: isExpanded? "0" : "50%",
		transition: "all 0.3s ease",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: "4em",
		left: "0.5em",
		zIndex: 3,
	}
)

