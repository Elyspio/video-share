import { HubConnectionBuilder } from "@microsoft/signalr";

export const connection = new HubConnectionBuilder()
	.withUrl(`${window.config.endpoints.hubs}/conversion`)
	.build();

connection.on("update-conversion-progression", (idVideo: string, percentage: number) => {
	console.log({ idVideo, percentage });
});

