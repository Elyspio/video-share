import "reflect-metadata";
import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import store, { useAppSelector } from "./store";
import Application from "./view/components/Application";
import { StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import { themes } from "./config/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Provider as DiProvider } from "inversify-react";
import { container } from "./core/di";

declare module "@mui/styles/defaultTheme" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {}
}

function Wrapper() {
	const { theme, current } = useAppSelector((state) => ({ theme: state.theme.current === "dark" ? themes.dark : themes.light, current: state.theme.current }));

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<Application />
				<ToastContainer theme={current} position={"top-right"} />
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

function App() {
	return (
		<DiProvider container={container}>
			<Provider store={store}>
				<Wrapper />
			</Provider>
		</DiProvider>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
