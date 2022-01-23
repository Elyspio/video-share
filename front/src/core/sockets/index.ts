import { connection as conversionCon } from "./conversion.socket";
import { connection as roomCon } from "./room.socket";

export async function initSockets() {
	await Promise.race([Promise.all([conversionCon.start(), roomCon.start()]), new Promise((resolve) => setTimeout(resolve, 1500))]);
}
