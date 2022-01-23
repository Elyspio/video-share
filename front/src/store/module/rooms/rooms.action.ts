import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../core/di";
import { push } from "@lagunovsky/redux-react-router";
import { routes } from "../../../config/routes";
import { DiKeysService } from "../../../core/di/services/di.keys.service";
import { RoomModel } from "../../../core/apis/backend/generated";
import { RoomService } from "../../../core/services/room.service";

const roomService = container.get<RoomService>(DiKeysService.room);

export const getRooms = createAsyncThunk("rooms/getRooms", async () => {
	return roomService.getRooms();
});

export const createRoom = createAsyncThunk("rooms/createRoom", async (params: { idVideo: RoomModel["idVideo"] }, { dispatch }) => {
	const video = await roomService.createRoom(params.idVideo);
	await dispatch(push(routes.videos));
	return video;
});

export const deleteRoom = createAsyncThunk("rooms/deleteRoom", async (params: { idRoom: RoomModel["name"] }, { dispatch }) => {
	await roomService.deleteRoom(params.idRoom);
	await dispatch(getRooms());
});

export const updateRoomState = createAsyncThunk("rooms/updateRoomState", async (params: { name: RoomModel["name"]; state: RoomModel["state"]; fromSocket?: boolean }) => {
	if (!params.fromSocket) {
		await roomService.updateRoomState(params.name, params.state);
	}
	return params;
});

type SeekTimeParams = { name: RoomModel["name"]; time: number; fromSocket?: boolean; synchro: string };
export const seekTime = createAction<SeekTimeParams>("rooms/seekTime");
export const setSeekingDone = createAction<RoomModel["name"]>("rooms/setSeekingDone");
