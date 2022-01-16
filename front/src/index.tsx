import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import store, { browserHistory, useAppSelector } from "./store";
import Application from "./view/components/Application";
import { CssBaseline, StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import { themes } from "./config/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Provider as DiProvider } from "inversify-react";
import { container } from "./core/di";
import { initSockets } from "./core/sockets";
import { ReduxRouter } from "@lagunovsky/redux-react-router";

declare module "@mui/styles/defaultTheme" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {
	}
}

function Wrapper() {
	const theme = useAppSelector((state) => (state.theme.current === "dark" ? themes.dark : themes.light));

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
					<Application />
				<ToastContainer position={"top-left"} />
				<CssBaseline />
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

function App() {
	return (
		<React.StrictMode>
		<DiProvider container={container}>
			<Provider store={store}>
				<ReduxRouter history={browserHistory} store={store} basename={process.env.NODE_ENV === "production" ? "/video-share" : "/"}>
					<Wrapper />
				</ReduxRouter>
			</Provider>
		</DiProvider>
		</React.StrictMode>
	);
}

initSockets().then(() => {
	ReactDOM.render(<App />, document.getElementById("root"));
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
