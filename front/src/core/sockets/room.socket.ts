import { HubConnectionBuilder } from "@microsoft/signalr";
import { RoomState } from "../apis/backend/generated";

export const connection = new HubConnectionBuilder()
	.withUrl("hubs/room")
	.build();

connection.on("update-video-state", (idVideo: string, state: RoomState) => {
	console.log({ idVideo, state });
});



