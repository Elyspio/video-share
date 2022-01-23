import React, { ReactNode, useRef } from "react";
import { Box, Fade, Grid, Paper, Slider, Stack, Typography } from "@mui/material";
import { RoomState } from "../../../store/module/rooms/rooms.reducer";
import { Pause, PlayArrow, Sync, VolumeDownRounded, VolumeUpRounded } from "@mui/icons-material";

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

class IconButton extends React.Component<{ onClick: (e?: React.MouseEvent) => void; size: string; children: ReactNode }> {
	render() {
		return null;
	}
}

export function Player({ src, onPlay, currentTime, onSeek, state, onPause, seekTimeInfo }: PlayerProps) {
	const ref = useRef<HTMLVideoElement>(null);

	const [position, setPosition] = React.useState(currentTime);
	const [volume, setVolume] = React.useState(0);

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

	console.log({ isPlaying, loading });

	return (
		<Paper>
			<Box m={1} py={1}>
				<Box style={{ position: "relative" }}>
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
							<Fade in={showHud}>
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
											<Stack spacing={2} direction="row" sx={{ mb: 1, px: 1 }} alignItems="center">
												{!isPlaying ? <PlayArrow onClick={playPause} /> : <Pause onClick={playPause} />}
												<Sync onClick={callbacks.synchronize}>Synchronize</Sync>
												<VolumeDownRounded />
												<Slider
													value={volume}
													size={"small"}
													max={1}
													min={0}
													sx={{ width: "10rem" }}
													step={0.05}
													onChange={(_, val) => onVolumeChange(val as number)}
													aria-label="Volume"
													defaultValue={30}
												/>
												<VolumeUpRounded />

												<Time current={ref.current.currentTime} duration={ref.current.duration} />
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
	return `${mn}:${ss}`;
}

interface TimeProps {
	duration: number;
	current: number;
}

function Time({ duration, current }: TimeProps) {
	return (
		<Typography>
			{parseTime(current)}:{parseTime(duration)}
		</Typography>
	);
}
