import React, { useEffect } from "react";
import { Box, Button, Divider, Grid, Paper, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Link } from "react-router-dom";
import { routes } from "../../../config/routes";
import { seekTime, setSeekingDone, updateRoomState } from "../../../store/module/rooms/rooms.action";
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
	const seekInfo = useAppSelector(s => s.rooms.seeking[name ?? ""])


	const [ref, setRef] = React.useState<HTMLVideoElement | null>(null);

	const [seeking, setSeeking] = React.useState<{}>();


	const dispatch = useAppDispatch();

	const callbacks = React.useMemo(() => {
		return {
			onPlay: (e?: Event) => {
				e?.preventDefault();
				return dispatch(updateRoomState({ name: data!.name, state: RoomState.Playing }));
			},
			onPause: (e?: Event) => {
				e?.preventDefault();
				return dispatch(updateRoomState({ name: data!.name, state: RoomState.Paused }));
			},
			onSeek: (e) => {
				const target = e.target as HTMLVideoElement;
				const time = target.currentTime;

			},
			synchronize: async () => {
				if(ref) {
					await dispatch(updateRoomState({ name: data!.name, state: RoomState.Paused }));
					await dispatch(seekTime({ name: data!.name, time: ref.currentTime }));
					setTimeout(() => {
						dispatch(updateRoomState({ name: data!.name, state: RoomState.Playing }));
					}, 2500)
				}
			}

		};

	}, [dispatch, data]);

	useEffect(() => {
		if (ref) {
			ref.addEventListener("playing", callbacks.onPlay);
			ref.addEventListener("pause", callbacks.onPause);
			ref.addEventListener("seeking", callbacks.onSeek);
		}
		return () => {
			if (ref) {
				ref.removeEventListener("play", callbacks.onPlay);
				ref.removeEventListener("pause", callbacks.onPause);
				ref.removeEventListener("seeking", callbacks.onSeek);
			}
		};
	}, [ref, callbacks]);

	React.useEffect(() => {
		if(ref && data) {
			const isPlaying = !ref.paused && !ref.ended && ref.currentTime > 0;
			if(data.state === RoomState.Playing && !isPlaying) ref.play()
			if(data.state === RoomState.Paused && isPlaying) ref.pause();
		}
	}, [data, ref]);


	React.useEffect(() => {
		if(ref && seekInfo && name) {
			if(seekInfo.status !== "done") {
				ref.currentTime = seekInfo.time;
				dispatch(setSeekingDone(name))
			}
		}
	}, [dispatch, ref, seekInfo, name])

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
					<video preload={"auto"} width={"100%"} src={videoUrl} height={"100%"} controls ref={r => setRef(r)}>
					</video>


					<Grid container>
						<Grid item>
							<Button onClick={callbacks.synchronize}>Synchronize</Button>
						</Grid>
					</Grid>

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