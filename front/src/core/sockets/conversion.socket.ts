import { HubConnectionBuilder } from "@microsoft/signalr";
import store from "../../store";
import { updateVideoConversionPercentage } from "../../store/module/videos/videos.action";

export const connection = new HubConnectionBuilder().withAutomaticReconnect().withUrl(`${window.config.endpoints.hubs}/conversion`).build();

connection.on("update-conversion-progression", (idVideo: string, percentage: number) => {
	store.dispatch(updateVideoConversionPercentage({ idVideo, percentage }));
});
