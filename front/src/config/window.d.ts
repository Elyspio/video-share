export type Config = {
	endpoints: {
		core: string;
		authentication: string;
		hubs: string
	};
	loginPageUrl: "http://localhost";
};

declare global {
	interface Window {
		config: Config;
	}
}
