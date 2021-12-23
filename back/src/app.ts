import "@tsed/platform-express"; // /!\ keep this import
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./web/server";
import { getLogger } from "./core/utils/logger";
import { httpPort } from "./config/web";

const logger = getLogger.default();

if (require.main === module) {
	logger.debug("Start server...");
	bootstrap().then(() => {
		logger.debug("Server initialized");
	});
}

async function bootstrap() {
	try {
		const platform = await PlatformExpress.bootstrap(Server, {});

		await platform.listen();

		logger.info(`Api documentation available at http://localhost:${httpPort}/swagger/swagger.json`);
	} catch (er) {
		logger.error(er);
	}
}
