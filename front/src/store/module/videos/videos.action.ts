import { createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../core/di";
import { push } from "connected-react-router";
import { routes } from "../../../config/routes";
import { VideoService } from "../../../core/services/video.service";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { VideoModel } from "../../../core/apis/backend/generated";

const service = container.get<VideoService>(DiKeysService.video);

export const getVideos = createAsyncThunk("videos/getVideos", async () => {
	return service.getVideos();
});

export const addVideo = createAsyncThunk("files/addVideo", async (params: { filename: string; location: string; file: File }, { dispatch }) => {
	await service.addVideo(params.filename, params.location, params.file);
	await dispatch(push(routes.home));
});

export const deleteFile = createAsyncThunk("files/deleteFile", async (params: { videoId: VideoModel["id"] }, { dispatch }) => {
	await service.deleteVideo(params.videoId);
});
