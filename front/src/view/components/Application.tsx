import * as React from "react";
import "./Application.scss";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import Videos from "./videos/Videos";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/module/theme/theme.action";
import { createDrawerAction, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box } from "@mui/material";
import { login, logout } from "../../store/module/authentication/authentication.action";
import { Add, Home, List, Login, Logout } from "@mui/icons-material";
import { routes } from "../../config/routes";
import { AddVideo } from "./videos/AddVideo";
import { push } from "@lagunovsky/redux-react-router";
import { Rooms } from "./room/Rooms";
import { Room } from "./room/Room";
import { Route, Routes } from "react-router-dom";
import { getRooms } from "../../store/module/rooms/rooms.action";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged, location } = useAppSelector((s) => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "dark" ? <Brightness5Icon /> : <Brightness3Icon />,
		logged: s.authentication.logged,
		location: s.router.location,
	}));

	const actions = [
		createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
			icon: themeIcon,
			onClick: () => dispatch(toggleTheme()),
		}),
	];


	if (logged) {
		actions.push(
			createDrawerAction("Logout", {
				icon: <Logout fill={"currentColor"} />,
				onClick: () => dispatch(logout()),
			}),
		);

	} else {
		actions.push(
			createDrawerAction("Login", {
				icon: <Login fill={"currentColor"} />,
				onClick: () => dispatch(login()),
			}),
		);
	}

	// region Application routes

	if (logged) {

		actions.push(createDrawerAction("Add Video", {
			icon: <Add />,
			onClick: () => dispatch(push(routes.addFile)),
		}));
	}

	if (location.pathname !== routes.videos) {
		actions.push(
			createDrawerAction("Videos", {
				icon: <Home fill={"currentColor"} />,
				onClick: () => dispatch(push(routes.videos)),
			}),
		);
	}

	if (location.pathname !== routes.rooms) {
		actions.push(
			createDrawerAction("Rooms", {
				icon: <List fill={"currentColor"} />,
				onClick: () => dispatch(push(routes.rooms)),
			}),
		);
	}
	// endregion


	const drawer = withDrawer({
		component:
			<Routes>
				<Route path={routes.videos} element={<Videos />} />
				<Route path={routes.addFile} element={<AddVideo />} />
				<Route path={routes.rooms} element={<Rooms />}/>
				<Route path={routes.room} element={<Room />} />
			</Routes>


		,
		actions,
		title: "Video Share",
	});

	React.useEffect(() => {
		dispatch(getRooms());
	}, [dispatch]);


	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			{drawer}
		</Box>
	);
}

export default Application;
