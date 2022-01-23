import React from "react";
import { VideoModel } from "../../../core/apis/backend/generated";
import { Box, Button, Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useAppDispatch, useAppSelector } from "../../../store";
import { convertVideo, deleteVideo } from "../../../store/module/videos/videos.action";
import { createRoom } from "../../../store/module/rooms/rooms.action";
import { Link } from "react-router-dom";

interface VideoProps {
	data: VideoModel;
}

export function Video({ data }: VideoProps) {
	const { rooms } = useAppSelector((s) => s.rooms);

	const room = React.useMemo(() => rooms.find((room) => room.idVideo === data.idConvertedFile), [rooms, data]);

	const conversion = useAppSelector((s) => s.videos.converting[data.id]);

	const dispatch = useAppDispatch();

	const convert = React.useCallback(() => {
		dispatch(convertVideo({ idVideo: data.id }));
	}, [dispatch, data.id]);

	const deleteAll = React.useCallback(() => {
		dispatch(deleteVideo({ idVideo: data.id }));
	}, [dispatch, data.id]);

	const create = React.useCallback(() => {
		dispatch(createRoom({ idVideo: data.id }));
	}, [dispatch, data.id]);

	return (
		<Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} p={2} m={1}>
			<Box>
				<Typography>id: {data.id}</Typography>
				<Typography>idFile: {data.idFile}</Typography>
				<Typography>idConvertedFile: {data.idConvertedFile ?? "not converted yet"}</Typography>
			</Box>

			<Box>
				<Grid container spacing={2}>
					<Grid item>
						{room ? (
							<Link to={`/rooms/${room.name}`}>
								<Button variant={"outlined"}>Watch</Button>
							</Link>
						) : data.idConvertedFile ? (
							<Button variant={"outlined"} onClick={create}>
								Create Room
							</Button>
						) : (
							<>
								{!conversion && (
									<Button variant={"outlined"} onClick={convert}>
										Convert
									</Button>
								)}
								{conversion?.status === "converting" && <Typography variant={"overline"}>{conversion.percentage.toFixed(1)} %</Typography>}
								{conversion?.status === "processing" && <Typography variant={"overline"}>Processing</Typography>}
							</>
						)}
					</Grid>

					<Grid item>
						<Button variant={"outlined"} color={"error"} onClick={deleteAll}>
							Delete
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);
}

export default Video;
