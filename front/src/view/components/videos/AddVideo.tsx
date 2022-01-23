import React from "react";
import { Box, Button, Divider, FormControl, Grid, Paper, TextField } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import { login } from "../../../store/module/authentication/authentication.action";
import { addVideo } from "../../../store/module/videos/videos.action";
import Typography from "@mui/material/Typography";

export function AddVideo() {
	const logged = useAppSelector((s) => s.authentication.logged);
	const uploading = useAppSelector((s) => s.videos.uploading);

	const dispatch = useAppDispatch();

	const [file, setFile] = React.useState<File | null>(null);
	const [filename, setFilename] = React.useState("");
	const [location, setLocation] = React.useState("/");

	const create = React.useCallback(async () => {
		if (file !== null) {
			dispatch(addVideo({ filename, location, file }));
		}
	}, [dispatch, filename, file, location]);

	const handleFile = React.useCallback((e) => {
		const files = e.target.files;
		let file = files?.[0] ?? null;
		if (files !== null) {
			setFilename(file.name);
		}
		return setFile(file);
	}, []);

	if (!logged)
		return (
			<Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
				<Button onClick={() => dispatch(login())}>Please login before access to this page</Button>
			</Box>
		);

	const emptyFile = file === null;
	return (
		<Paper className={"AddFile"}>
			<Box px={8} py={4} width={"50vw"} maxWidth={600}>
				<Grid container direction={"column"} alignItems={"center"} spacing={6}>
					<Grid item container xs={12} alignItems={"center"} direction={"column"}>
						<Typography variant={"overline"}>Add a file</Typography>
						<Divider className={"Divider"} />
					</Grid>

					<Grid item xs={6} container>
						<Button variant="outlined" component="label" fullWidth title={emptyFile ? "Select a file" : "Replace selected file"}>
							Select File
							<input type="file" onChange={handleFile} hidden />
						</Button>
					</Grid>

					{!emptyFile && (
						<>
							<Grid item xs={6} container>
								<FormControl fullWidth>
									<TextField
										size={"small"}
										id="outlined-basic"
										label="Location"
										variant="outlined"
										value={location}
										disabled={emptyFile}
										onChange={(e) => setLocation(e.target.value)}
									/>
								</FormControl>
							</Grid>

							<Grid item xs={6} container>
								<FormControl fullWidth>
									<TextField
										size={"small"}
										id="outlined-basic"
										label="Filename"
										variant="outlined"
										value={filename}
										disabled={emptyFile}
										onChange={(e) => setFilename(e.target.value)}
									/>
								</FormControl>
							</Grid>

							<Grid item xs={12} container justifyContent={"center"}>
								<Button size={"large"} color={"primary"} variant={"outlined"} disabled={filename.length === 0 || emptyFile} onClick={create}>
									{(!uploading || uploading.status === "uploading") && `Create ${uploading ? `${uploading.percentage.toFixed(0)}%` : undefined}`}
									{uploading?.status === "processing" && "Processing"}
								</Button>
							</Grid>
						</>
					)}
				</Grid>
			</Box>
		</Paper>
	);
}
