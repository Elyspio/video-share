import { createReducer } from "@reduxjs/toolkit";
import { addVideo, convertVideo, getVideos, updateVideoConversionPercentage, updateVideoUploadPercentage } from "./videos.action";
import { VideoModel } from "../../../core/apis/backend/generated";

export interface VideoState {
	videos: VideoModel[];
	converting: Record<VideoModel["id"], { percentage: number; status: "converting" | "processing" | "finished" }>;
	uploading?: { percentage: number; status: "uploading" | "processing" };
}

const defaultState: VideoState = {
	videos: [],
	converting: {},
};

export const videosReducer = createReducer(defaultState, (builder) => {
	builder.addCase(updateVideoConversionPercentage, (state, { payload }) => {
		if (payload.percentage < 100) {
			state.converting[payload.idVideo] = {
				percentage: payload.percentage,
				status: "converting",
			};
		} else {
			state.converting[payload.idVideo] = {
				percentage: payload.percentage,
				status: "processing",
			};
		}
	});

	builder.addCase(updateVideoUploadPercentage, (state, { payload: percentage }) => {
		if (!state.uploading) {
			state.uploading = { percentage, status: "uploading" };
		} else {
			state.uploading = {
				percentage,
				status: percentage < 100 ? "uploading" : "processing",
			};
		}
	});

	builder.addCase(addVideo.fulfilled, (state, { payload }) => {
		const others = state.videos.filter((video) => video.id !== payload.id);
		state.videos = [...others, payload];
		state.uploading = undefined;
	});

	builder.addCase(getVideos.fulfilled, (state, { payload }) => {
		state.videos = payload;
	});

	builder.addCase(convertVideo.fulfilled, (state, { payload }) => {
		const others = state.videos.filter((video) => video.id !== payload.id);
		state.videos = [...others, payload];
		state.converting[payload.id].status = "finished";
	});
});
