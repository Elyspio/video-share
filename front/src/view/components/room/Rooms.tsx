import React from "react";
import { Box, Button, Grid, Paper } from "@mui/material";
import { useAppSelector } from "../../../store";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { getRoute } from "../../../config/routes";

export function Rooms() {
	const { rooms } = useAppSelector((s) => s.rooms);

	return (
		<Grid container className={"Rooms"} width={"100%"} direction={"column"} height={"100%"}>
			{rooms.map((room) => (
				<Grid item key={room.name} width={"100%"}>
					<Paper sx={{ width: "100%", p: 2 }}>
						<Box display={"flex"} alignItems={"center"} width={"100%"} justifyContent={"space-between"}>
							<Typography>Filename: {room.fileName}</Typography>
							<Link to={getRoute(`/${room.name}`)}>
								<Button variant={"outlined"}>Watch</Button>
							</Link>
						</Box>
					</Paper>
				</Grid>
			))}
		</Grid>
	);
}
