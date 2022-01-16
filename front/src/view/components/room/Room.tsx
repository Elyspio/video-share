import React, { useEffect } from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Link } from "react-router-dom";
import { routes } from "../../../config/routes";
import { seekTime, updateRoomState } from "../../../store/module/rooms/rooms.action";
import { RoomState } from "../../../core/apis/backend/generated";

interface MetadataItemProps {
	label: string,
	value: string
}

function Metadata({ label, value }: MetadataItemProps) {
	return <Typography>{label}: <Typography variant={"body2"} color={"gray"} component={"span"}>{value}</Typography> </Typography>;

}


export function Room() {

	const { name } = useParams();


	const data = useAppSelector(s => s.rooms.rooms.find(room => room.name === name));


	const [ref, setRef] = React.useState<HTMLVideoElement | null>(null);

	const [seeking, setSeeking] = React.useState<{}>()


	const dispatch = useAppDispatch();

	const callbacks = React.useMemo(() => {
		return {
			onPlay: () => dispatch(updateRoomState({name: data!.name, state: RoomState.Playing})),
			onPause: () => dispatch(updateRoomState({name: data!.name, state: RoomState.Paused})),
			onSeek: (e) => {
				const target = e.target.value as HTMLVideoElement
				const time =  target.currentTime;
				dispatch(seekTime({name: data!.name, time}))
			}

		}

	}, [dispatch, data])

	useEffect(() => {
		if(ref) {
			ref.addEventListener("play", callbacks.onPlay)
			ref.addEventListener("pause", callbacks.onPause)
			ref.addEventListener("seeking", callbacks.onSeek)
		}
		return () => {
			if(ref) {
				ref.removeEventListener("play", callbacks.onPlay)
				ref.removeEventListener("pause", callbacks.onPause)
				ref.removeEventListener("seeking", callbacks.onSeek)
			}
		}
	}, [ref])

	const videoUrl = React.useMemo(() => {
		if (data) {
			return window.config.videoUrlTemplate.replace("{id}", data.idVideo);
		}
		return "";
	}, [data]);

	if (!name) return <RoomNotProvided />;

	if (!data) return <RoomNotFound name={name} />;

	return (
		<Box className={"Room"}>
			<Paper sx={{ p: 2 }}>
				<Typography variant={"overline"}>Metadata</Typography>
				<Divider sx={{ mb: 2 }} />
				<Metadata label={"Room"} value={data.name} />
				<Metadata label={"Id video"} value={data.idVideo} />
				<Metadata label={"Filename"} value={data.fileName} />
				<Metadata label={"State"} value={data.state} />
			</Paper>

			<Paper>


				<Box margin={1}>
					<video width={"100%"} src={videoUrl} height={"100%"}  controls ref={r => setRef(r)}>
					</video>
				</Box>

			</Paper>

		</Box>
	);
}


interface RoomNotFoundProps {
	name: string;
}

function RoomNotFound({ name }: RoomNotFoundProps) {
	return <Box>
		<Typography>Could not find a room with id {name}</Typography>
		<Link to={routes.rooms}>See other rooms</Link>
	</Box>;
}

function RoomNotProvided() {
	return <Box>
		<Typography>You must provide a room name</Typography>
		<Link to={routes.rooms}>See other rooms</Link>
	</Box>;
}