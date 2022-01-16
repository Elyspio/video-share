import { Box, Container, Grid, Paper } from "@mui/material";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getVideos } from "../../../store/module/videos/videos.action";
import { Video } from "./Video";

const Videos = () => {
	const dispatch = useAppDispatch();
	React.useEffect(() => {
		dispatch(getVideos());
	}, [dispatch]);

	const { videos } = useAppSelector(s => s.videos);

	return (
		<Container className={"Videos"} >
			<Paper>
				<Box p={2}>
					<Grid container direction={"column"} spacing={2}>
						{videos.map(video => <Grid key={video.id} item>
							<Video data={video} />
						</Grid>)}
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
};

export default Videos;
