export const routes = {
	videos: "/",
	addFile: "/new",
	rooms: "/rooms",
	room: "/rooms/:name"
};

export type Routes = keyof typeof routes;
