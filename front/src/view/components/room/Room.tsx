import React from "react";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useAppSelector } from "../../../store";
import { Link } from "react-router-dom";
import { routes } from "../../../config/routes";
import { RoomState } from "../../../core/apis/backend/generated";
import { RequireLogin } from "../utils/RequireLogin";
import { useInjection } from "inversify-react";
import { RoomService } from "../../../core/services/room.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { Player, PlayerProps } from "./Player";
import { setSeekingDone } from "../../../store/module/rooms/rooms.action";
import "./Player.scss";
interface MetadataItemProps {
	label: string;
	value: string;
}

function Metadata({ label, value }: MetadataItemProps) {
	return (
		<Typography>
			{label}:{" "}
			<Typography variant={"body2"} color={"gray"} component={"span"}>
				{value}
			</Typography>{" "}
		</Typography>
	);
}

export function Room() {
	const { name } = useParams();

	const services = {
		rooms: useInjection<RoomService>(DiKeysService.room),
	};

	const data = useAppSelector((s) => s.rooms.rooms.find((room) => room.name === name));
	const seekInfo = useAppSelector((s) => s.rooms.seeking);
	const isLogged = useAppSelector((s) => s.authentication.logged);

	const [currentTime, setCurrentTime] = React.useState(0);
	const [state, setState] = React.useState<PlayerProps["state"]>("playing");

	// const seeking = React.useMemo(() => {
	// 	if (!seekInfo) return false;
	// 	return seekInfo.status !== "done";
	// }, [seekInfo]);

	const videoUrl = React.useMemo(() => {
		if (data) {
			return window.config.videoUrlTemplate.replace("{id}", data.idVideo);
		}
		return "";
	}, [data]);

	const callbacks = React.useMemo(() => {
		return {
			onPlay: async () => {
				await services.rooms.updateRoomState(data!.name, RoomState.Playing);
			},
			onPause: async () => {
				await services.rooms.updateRoomState(data!.name, RoomState.Paused);
			},
			onSeek: async (time: number) => {
				await services.rooms.seekTime(data!.name, time);
			},
		};
	}, [data, services.rooms]);

	React.useEffect(() => {
		let timeout: NodeJS.Timeout;
		if (seekInfo) {
			if (seekInfo.status === "fetching") {
				setState("pause");
				setCurrentTime(seekInfo.time);
				const diff = new Date(seekInfo.synchro).getTime() - Date.now();
				timeout = setTimeout(() => {
					setState("playing");
					setSeekingDone(data!.name);
				}, diff);
			}
		}
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [data, seekInfo]);

	React.useEffect(() => {
		if (data) {
			console.log("room", state, data.state);
			if (state === "playing" && data.state === RoomState.Paused) {
				console.log("room pause");
				setState("pause");
			}
			if (state === "pause" && data.state === RoomState.Playing) {
				console.log("room playing");
				setState("playing");
			}
		}
	}, [data, state]);

	if (!isLogged) return <RequireLogin route={window.location.pathname} />;

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

			<Player state={state} currentTime={currentTime} onPause={callbacks.onPause} onPlay={callbacks.onPlay} onSeek={callbacks.onSeek} src={videoUrl} />
		</Box>
	);
}

interface RoomNotFoundProps {
	name: string;
}

function RoomNotFound({ name }: RoomNotFoundProps) {
	return (
		<Box>
			<Typography>Could not find a room with id {name}</Typography>
			<Button color={"inherit"}>
				<Link to={routes.rooms}>See other rooms</Link>
			</Button>
		</Box>
	);
}

function RoomNotProvided() {
	return (
		<Box>
			<Typography>You must provide a room name</Typography>
			<Button color={"inherit"}>
				<Link to={routes.rooms}>See other rooms</Link>
			</Button>
		</Box>
	);
}
