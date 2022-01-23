import React from "react";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { useAppDispatch } from "../../../store";
import { login } from "../../../store/module/authentication/authentication.action";
import { push } from "@lagunovsky/redux-react-router";
import { routes } from "../../../config/routes";

export function RequireLogin(props: { route: keyof typeof routes | string }) {
	const dispatch = useAppDispatch();
	const log = React.useCallback(() => {
		dispatch(login()).then(() => {
			dispatch(push(routes[props.route]));
		});
	}, [dispatch, props.route]);

	return (
		<Paper>
			<Grid p={2} container className={"RequireLogin"} direction={"column"} alignItems={"center"} justifyContent={"center"} spacing={4}>
				<Grid item>
					<Typography variant={"overline"}>You must be logged</Typography>
				</Grid>
				<Grid item>
					<Button color={"primary"} variant="outlined" onClick={log}>
						Login
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}
