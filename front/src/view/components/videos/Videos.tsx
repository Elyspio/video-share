import { Box, Container, Grid, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getVideos } from "../../../store/module/videos/videos.action";

const Videos = () => {
	const dispatch = useAppDispatch();
	React.useEffect(() => {
		dispatch(getVideos());
	}, [dispatch]);

	const { videos } = useAppSelector(s => s.videos);

	return (
		<Container className={"Videos"}>
			<Paper>
				<Box p={2}>
					<Grid container direction={"column"} spacing={2}>
						{videos.map(video => <Grid item>
							<Typography>id: {video.id}</Typography>
							<Typography>idFile: {video.idFile}</Typography>
							<Typography>idConvertedFile: {video.idConvertedFile ?? "not converted yet"}</Typography>
						</Grid>)}
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
};

export default Videos;
