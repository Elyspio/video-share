export type Config = {
	endpoints: {
		core: string;
		authentication: string;
		hubs: string;
	};
	loginPageUrl: string;
	videoUrlTemplate: string;
};

declare global {
	interface Window {
		config: Config;
	}
}
