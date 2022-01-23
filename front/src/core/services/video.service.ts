import { inject, injectable } from "inversify";
import { VideoClient } from "../apis/backend";
import { DiKeysApi } from "../di/apis/di.keys.api";

@injectable()
export class VideoService {
	@inject(DiKeysApi.video)
	private videoClient!: VideoClient;

	public async getVideos() {
		const response = await this.videoClient.client.getVideos();
		return response.data;
	}

	public async addVideo(filename: string, container: string, file: File) {
		const response = await this.videoClient.client.addVideo(filename, container, file, {
			onUploadProgress: async (evt: ProgressEvent) => {
				const store = (await import("../../store")).default;
				const { updateVideoUploadPercentage } = await import("../../store/module/videos/videos.action");
				store.dispatch(updateVideoUploadPercentage((evt.loaded / evt.total) * 100));
			},
		});
		return response.data;
	}

	public async deleteVideo(idVideo: string) {
		await this.videoClient.client.deleteVideo(idVideo);
	}

	public async convertVideo(idVideo: string) {
		const response = await this.videoClient.client.convertVideo(idVideo);
		return response.data;
	}
}
