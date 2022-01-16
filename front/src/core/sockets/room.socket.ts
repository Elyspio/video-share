import { HubConnectionBuilder } from "@microsoft/signalr";
import { RoomModel, RoomState } from "../apis/backend/generated";
import store from "../../store";
import { seekTime, updateRoomState } from "../../store/module/rooms/rooms.action";

export const connection = new HubConnectionBuilder()
	.withAutomaticReconnect()
	.withUrl(`${window.config.endpoints.hubs}/room`)
	.build();

connection.on("update-room-state", (idRoom: RoomModel["name"], state: RoomState) => {
	const storeState = store.getState();
	const room = storeState.rooms.rooms.find(room => room.name === idRoom);
	store.dispatch(updateRoomState({ name: idRoom, state, fromSocket: true }));
});


connection.on("seek-time", (idRoom: RoomModel["name"], time: number) => {
	store.dispatch(seekTime({ name: idRoom, time, fromSocket: true }));
});

