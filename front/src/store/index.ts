import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { themeReducer } from "./module/theme/theme.reducer";
import { authenticationReducer } from "./module/authentication/authentication.reducer";
import { createBrowserHistory } from "history";
import { videosReducer } from "./module/videos/videos.reducer";
import { roomsReducer } from "./module/rooms/rooms.reducer";
import { createRouterMiddleware, createRouterReducer } from "@lagunovsky/redux-react-router";

export const browserHistory = createBrowserHistory();

const routerMiddleware = createRouterMiddleware(browserHistory);

const createRootReducer = (history) =>
	combineReducers({
		router: createRouterReducer(history),
		theme: themeReducer,
		authentication: authenticationReducer,
		videos: videosReducer,
		rooms: roomsReducer,
		// rest of your reducers
	});

const store = configureStore({
	reducer: createRootReducer(browserHistory),
	devTools: process.env.NODE_ENV !== "production",
	middleware: (getDefaultMiddleware) => [routerMiddleware, ...getDefaultMiddleware()],
});
export type StoreState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector;

export default store;
