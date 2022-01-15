import { HubConnectionBuilder } from "@microsoft/signalr";

export const connection = new HubConnectionBuilder()
	.withUrl("hubs/conversion")
	.build();

connection.on("update-conversion-progression", (idVideo: string, percentage: number) => {
	console.log({ idVideo, percentage });
});

