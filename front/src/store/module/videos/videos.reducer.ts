import { createReducer } from "@reduxjs/toolkit";
import { getVideos } from "./videos.action";
import { VideoModel } from "../../../core/apis/backend/generated";

export interface ThemeState {
	videos: VideoModel[];
}

const defaultState: ThemeState = {
	videos: [],
};

export const videosReducer = createReducer(defaultState, (builder) => {
	builder.addCase(getVideos.fulfilled, (state, action) => {
		state.videos = action.payload;
	});
});
