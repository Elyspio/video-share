import { Box, CircularProgress, Container, Grid, Paper } from "@mui/material";
import "./Test.scss";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as React from "react";
import { useAsyncEffect } from "../../hooks/useAsyncEffect";
import { useAsyncCallback } from "../../hooks/useAsyncCallback";
import { useInjection } from "inversify-react";
import { AuthenticationEvents } from "../../../core/services/authentication.service";
import { ExampleService } from "../../../core/services/example.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";

const Test = () => {
	const services = {
		example: useInjection<ExampleService>(DiKeysService.example),
	};

	const [msg, setMsg] = React.useState("");
	const [admin, setAdmin] = React.useState("");

	const [fetchAdmin, { isExecuting, error }] = useAsyncCallback(async () => {
		const data = await services.example.getAdminContent();
		if (data) {
			setAdmin(data);
		}
	}, []);

	useAsyncEffect(async () => {
		const data = await services.example.getContent();
		setMsg(data);

		AuthenticationEvents.on("login", () => {
			fetchAdmin();
		});
	}, []);

	return (
		<Container className={"Test"}>
			<Paper>
				<Box p={2}>
					<Grid container direction={"column"} spacing={2}>
						<Grid item container alignItems={"center"} spacing={4}>
							<Grid item>
								<Typography color={"textPrimary"} variant={"overline"}>
									Test
								</Typography>
							</Grid>
							<Grid item>
								<Typography color={"textSecondary"}>{msg}</Typography>
							</Grid>
						</Grid>

						<Grid item container alignItems={"center"} spacing={4}>
							<Grid item>
								<Typography color={"textPrimary"} variant={"overline"}>
									Test (Admin)
								</Typography>
							</Grid>
							<Grid item>
								<Button color={"primary"} style={{ width: "12rem", height: "2.5rem" }} variant={"outlined"} onClick={fetchAdmin}>
									{isExecuting ? <CircularProgress /> : "Fetch admin"}
								</Button>
							</Grid>
							<Grid item>
								<Typography color={"textSecondary"}>{admin}</Typography>
							</Grid>
							{error && (
								<Grid item>
									<Typography color={"error"}>{error.toString()}</Typography>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</Container>
	);
};

export default Test;
