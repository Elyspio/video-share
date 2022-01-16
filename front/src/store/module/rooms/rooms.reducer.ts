import { createReducer } from "@reduxjs/toolkit";
import { createRoom, deleteRoom, getRooms, seekTime, setSeekingDone, updateRoomState } from "./rooms.action";
import { RoomModel } from "../../../core/apis/backend/generated";

export interface RoomState {
	rooms: RoomModel[];
	seeking: Record<RoomModel["name"], {
		status: "fetching" | "done",
		time: number
	}>;
}

const defaultState: RoomState = {
	rooms: [],
	seeking: {},
};

export const roomsReducer = createReducer(defaultState, (builder) => {

	builder.addCase(deleteRoom.fulfilled, (state, action) => {
		state.rooms = state.rooms.filter(room => room.name === action.meta.arg.idRoom);
	});

	builder.addCase(createRoom.fulfilled, (state, { payload }) => {
		const others = state.rooms.filter(video => video.name !== payload.name);
		state.rooms = [...others, payload];
	});

	builder.addCase(getRooms.fulfilled, (state, { payload }) => {
		state.rooms = payload;
	});

	builder.addCase(updateRoomState.fulfilled, (state, { payload }) => {
		const room = state.rooms.find(room => room.name === payload.name);
		if (room) {
			room.state = payload.state;
		}
	});

	builder.addCase(seekTime.fulfilled, (state, { payload }) => {
		if(state.rooms.some(room => room.name === payload.name)) {
			state.seeking[payload.name] = {
				status: "fetching",
				time: payload.time,
			};
		}
	});

	builder.addCase(setSeekingDone, (state, { payload }) => {
		state.seeking[payload].status = "done";
	});

});
