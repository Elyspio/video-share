import { createReducer } from "@reduxjs/toolkit";
import { createRoom, deleteRoom, getRooms, seekTime, setSeekingDone, updateRoomState } from "./rooms.action";
import { RoomModel, RoomState as RoomStateEnum } from "../../../core/apis/backend/generated";

export interface RoomState {
	rooms: RoomModel[];
	seeking?: {
		status: "fetching" | "done";
		time: number;
		synchro: string;
	};
}

const defaultState: RoomState = {
	rooms: [],
};

export const roomsReducer = createReducer(defaultState, (builder) => {
	builder.addCase(deleteRoom.fulfilled, (state, action) => {
		state.rooms = state.rooms.filter((room) => room.name === action.meta.arg.idRoom);
	});

	builder.addCase(createRoom.fulfilled, (state, { payload }) => {
		const others = state.rooms.filter((video) => video.name !== payload.name);
		state.rooms = [...others, payload];
	});

	builder.addCase(getRooms.fulfilled, (state, { payload }) => {
		state.rooms = payload;
	});

	builder.addCase(updateRoomState.fulfilled, (state, { payload }) => {
		const room = state.rooms.find((room) => room.name === payload.name);
		if (room) {
			room.state = payload.state;
		}
	});

	builder.addCase(seekTime, (state, { payload }) => {
		if (state.rooms.some((room) => room.name === payload.name)) {
			state.seeking = {
				status: "fetching",
				time: payload.time,
				synchro: payload.synchro,
			};
		}
	});

	builder.addCase(setSeekingDone, (state, { payload }) => {
		if (!state.seeking) throw new Error(`There is not seeking info for the room ${payload}`);
		state.seeking.status = "done";
		const room = state.rooms.find((room) => room.name === payload);
		if (room) {
			room.state = RoomStateEnum.Playing;
		}
	});
});
