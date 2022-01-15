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
		const response = await this.videoClient.client.addVideo(filename, container, { fileName: filename, data: file });
		return response.data;
	}

	public async deleteVideo(idVideo: string) {
		await this.videoClient.client.deleteVideo(idVideo);
	}
}
