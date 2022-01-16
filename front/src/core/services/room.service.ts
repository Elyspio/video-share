import { inject, injectable } from "inversify";
import { RoomClient } from "../apis/backend";
import { DiKeysApi } from "../di/apis/di.keys.api";
import { RoomModel } from "../apis/backend/generated";

@injectable()
export class RoomService {
	@inject(DiKeysApi.room)
	private roomClient!: RoomClient;

	public async getRooms() {
		const response = await this.roomClient.client.getRooms();
		return response.data;
	}

	public async getRoom(id: RoomModel["name"]) {
		const response = await this.roomClient.client.getRoom(id);
		return response.data;
	}

	public async createRoom(idVideo: RoomModel["idVideo"]) {
		const response = await this.roomClient.client.createRoom(idVideo);
		return response.data;
	}

	public async deleteRoom(id: RoomModel["name"]) {
		const response = await this.roomClient.client.createRoom(id);
		return response.data;
	}


	public async updateRoomState(id: RoomModel["name"], state: RoomModel["state"]) {
		await this.roomClient.client.updateRoomState(id, state);
	}

}
