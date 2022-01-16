import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../core/di";
import { push } from "@lagunovsky/redux-react-router";
import { routes } from "../../../config/routes";
import { VideoService } from "../../../core/services/video.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { VideoModel } from "../../../core/apis/backend/generated";

const videoService = container.get<VideoService>(DiKeysService.video);

export const getVideos = createAsyncThunk("videos/getVideos", async () => {
	return videoService.getVideos();
});

export const addVideo = createAsyncThunk("videos/addVideo", async (params: { filename: string; location: string; file: File }, { dispatch }) => {
	const video = await videoService.addVideo(params.filename, params.location, params.file);
	await dispatch(push(routes.videos));
	return video;
});

export const deleteVideo = createAsyncThunk("videos/deleteVideo", async (params: { idVideo: VideoModel["id"] }, { dispatch }) => {
	await videoService.deleteVideo(params.idVideo);
	await dispatch(getVideos());
});

export const convertVideo = createAsyncThunk("videos/convertVideo", async (params: { idVideo: VideoModel["id"] }) => {
	return await videoService.convertVideo(params.idVideo);
});

export const updateVideoConversionPercentage = createAction<{ idVideo: VideoModel["id"], percentage: number }>("videos/updateVideoConversionPercentage");