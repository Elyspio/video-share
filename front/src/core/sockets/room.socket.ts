import { HubConnectionBuilder } from "@microsoft/signalr";
import { RoomModel, RoomState } from "../apis/backend/generated";
import store from "../../store";
import { seekTime, updateRoomState } from "../../store/module/rooms/rooms.action";

export const connection = new HubConnectionBuilder()
	.withAutomaticReconnect()
	.withUrl(`${window.config.endpoints.hubs}/room`)
	.build();

connection.on("update-room-state", (idRoom: RoomModel["name"], state: RoomState) => {
	store.dispatch(updateRoomState({ name: idRoom, state }));
});


connection.on("seek-time", (idRoom: RoomModel["name"], time: number) => {
	store.dispatch(seekTime({ name: idRoom, time }));
});

