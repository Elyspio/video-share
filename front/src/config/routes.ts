export const routes = {
	videos: "/",
	addFile: "/add",
	rooms: "/rooms",
	room: "/rooms/:name",
	notLogged: "/not-logged",
};

if (process.env.NODE_ENV === "production") {
	Object.entries(routes).forEach(([key, val]) => {
		routes[key] = getRoute(val);
	});
}

export function getRoute(route) {
	return "/videos" + route;
}

export type Routes = keyof typeof routes;
