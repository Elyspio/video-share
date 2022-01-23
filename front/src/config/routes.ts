export const routes = {
	videos: "/videos",
	addFile: "/videos/new",
	rooms: "/",
	room: "/:name",
	notLogged: "/not-logged",
};

if (process.env.NODE_ENV === "production") {
	Object.entries(routes).forEach(([key, val]) => {
		routes[key] = "/video-share" + val;
	});
}

export type Routes = keyof typeof routes;
