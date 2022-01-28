import React, { useRef } from "react";
import { Box, Collapse, Fade, Grid, Paper, Slider, Stack, Typography } from "@mui/material";
import { RoomState } from "../../../store/module/rooms/rooms.reducer";
import { Fullscreen, FullscreenExit, Pause, PlayArrow, Sync, VolumeDown, VolumeMute, VolumeUp } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

export type PlayerState = "playing" | "pause";

type Voids = void | Promise<void>;

export interface PlayerProps {
	state: PlayerState;
	currentTime: number;
	onPause: () => Voids;
	onPlay: () => Voids;
	onSeek: (time: number) => Voids;
	src: string;
	seekTimeInfo?: RoomState["seeking"];
}

export function Player({ src, onPlay, currentTime, onSeek, state, onPause, seekTimeInfo }: PlayerProps) {
	const ref = useRef<HTMLVideoElement>(null);

	const [position, setPosition] = React.useState(currentTime);
	const [volume, setVolume] = React.useState(0);
	const [fullscreen, setFullScreen] = React.useState(false);

	const isPlaying = ref.current && !ref.current.paused && !ref.current.ended && ref.current.currentTime > 0;
	const loading = ref.current?.readyState !== 4;

	const [showHud, setShowHud] = React.useState(false);

	React.useEffect(() => {
		if (ref.current) {
			if (state === "playing" && !isPlaying)
				ref.current
					.play()
					.then(() => console.log("play"))
					.catch((e) => console.error("play", e));
			if (state === "pause" && isPlaying) {
				console.log("pause");
				ref.current.pause();
			}
		}
	}, [state, ref, isPlaying]);

	React.useEffect(() => {
		if (ref.current) ref.current.currentTime = currentTime;
		setPosition(currentTime);
	}, [ref, currentTime]);

	const callbacks = React.useMemo(() => {
		return {
			onPlay: (e?: Event) => {
				onPlay();
			},
			onPause: (e?: Event) => {
				onPause();
			},
			onSeek: (time) => {
				onSeek(time);
			},
			synchronize: async () => {
				if (ref.current) {
					onSeek(ref.current.currentTime);
				}
			},
		};
	}, [onPlay, onPause, onSeek, ref]);

	const playPause = React.useCallback(
		(e?: React.MouseEvent) => {
			e?.preventDefault();
			e?.stopPropagation();
			if (ref.current) {
				if (ref.current.paused) {
					callbacks.onPlay();
				} else {
					callbacks.onPause();
				}
			}
		},
		[ref, callbacks]
	);

	const onVolumeChange = React.useCallback(
		(val: number) => {
			if (ref.current) {
				ref.current.volume = val;
				setVolume(val);
			}
		},
		[ref]
	);

	const toggleFullScreen = React.useCallback(() => {
		setFullScreen((prev) => {
			if (prev) {
				document.exitFullscreen();
			} else {
				ref.current?.parentElement?.requestFullscreen();
			}
			return !prev;
		});
	}, []);

	return (
		<Paper className={"Player"}>
			<Box m={1} py={1}>
				<Box style={{ position: fullscreen ? "inherit" : "relative" }}>
					<video
						muted={volume === 0}
						width={"100%"}
						src={src}
						height={"100%"}
						ref={ref}
						onTimeUpdate={(e) => setPosition(e.currentTarget.currentTime)}
						onClick={playPause}
						onDoubleClick={() => {}}
					/>
					{ref.current && (
						<Box sx={{ position: "absolute", bottom: 7, width: "100%", height: 80 }} onMouseEnter={() => setShowHud(true)} onMouseLeave={() => setShowHud(false)}>
							<Fade in={showHud} timeout={{ enter: 250, exit: 750 }}>
								{loading ? (
									<Typography>Loading</Typography>
								) : (
									<Grid container direction={"column"} sx={{ backgroundColor: "#000000AA", p: 1 }}>
										<Grid container item>
											<Slider
												onChange={(_, val) => setPosition(val as number)}
												onChangeCommitted={(_, val) => callbacks.onSeek(val as number)}
												color={"secondary"}
												size={"small"}
												min={0}
												max={ref.current?.duration || 1}
												value={position}
												step={1}
											/>
										</Grid>

										<Grid item>
											<Stack spacing={2} direction="row" sx={{ mb: 1, px: 1, zIndex: 10 }} alignItems="center">
												<IconButton size={"small"} onClick={playPause}>
													{!isPlaying ? <PlayArrow /> : <Pause />}
												</IconButton>
												<IconButton onClick={callbacks.synchronize} size={"small"}>
													<Sync>Synchronize</Sync>
												</IconButton>

												<Volume onChange={onVolumeChange} value={volume} />

												<Time current={ref.current.currentTime} duration={ref.current.duration} />
												<div style={{ marginRight: "auto" }} />
												<Stack direction={"row"} justifyContent={"flex-end"}>
													<IconButton size={"small"} onClick={toggleFullScreen}>
														{fullscreen ? <FullscreenExit /> : <Fullscreen />}
													</IconButton>
												</Stack>
											</Stack>
										</Grid>
									</Grid>
								)}
							</Fade>
						</Box>
					)}
				</Box>
			</Box>
		</Paper>
	);
}

function parseTime(time: number) {
	const mn = Math.floor(time / 60);
	const ss = time % 60;

	let str = "";
	if (mn < 10) str += "0";
	str += mn.toFixed(0);
	str += ":";

	if (ss < 10) str += "0";
	str += ss.toFixed(0);

	return str;
}

interface TimeProps {
	duration: number;
	current: number;
}

function Time({ duration, current }: TimeProps) {
	return (
		<Typography>
			{parseTime(current)} / {parseTime(duration)}
		</Typography>
	);
}

interface VolumeProps {
	onChange: (val: number) => void;
	value: number;
}

function Volume({ onChange, value }: VolumeProps) {
	const [show, setShow] = React.useState(false);

	return (
		<Stack onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} direction={"row"} spacing={1} className={"Volume"}>
			<IconButton onClick={() => onChange(0)} size={"small"}>
				{value === 0 ? <VolumeMute /> : value < 0.5 ? <VolumeDown /> : <VolumeUp />}
			</IconButton>
			<Collapse in={show} orientation={"horizontal"} timeout={500}>
				<Box display={"flex"} alignItems={"center"} height={"100%"}>
					<Slider
						color={"secondary"}
						value={value}
						size={"small"}
						max={1}
						min={0}
						sx={{ width: "10rem", mx: 1 }}
						step={0.05}
						onChange={(_, val) => onChange(val as number)}
						aria-label="Volume"
					/>
				</Box>
			</Collapse>
		</Stack>
	);
}
