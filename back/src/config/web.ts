import * as path from "path";
import { Configuration } from "@tsed/common";
import { Helper } from "../core/utils/helper";
import isDev = Helper.isDev;

export const allowedOrigins = isDev() ? ["http://127.0.0.1:3000", "http://localhost:3000"] : ["https://elyspio.fr"];

export const rootDir = path.resolve(__dirname, "..");

let frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build");

export const httpPort = process.env.HTTP_PORT || 4000;

export const webConfig: Partial<Configuration> = {
	rootDir,
	acceptMimes: ["application/json", "text/plain"],
	httpPort,
	httpsPort: false, // CHANGE
	mount: {
		"/api": [`${rootDir}/web/controllers/**/*.ts`],
	},
	componentsScan: [`${rootDir}/core/**/*ts`],
	exclude: ["**/*.spec.ts"],
	statics: {
		"/": [{ root: frontPath }],
	},
	swagger: [
		{
			path: "/swagger",
			specVersion: "3.0.3",
			operationIdPattern: "%m",
			showExplorer: true,
			options: {
				urls: [
					{
						url: isDev() ? "/swagger/swagger.json" : "/TODO/swagger/swagger.json", // FIXME
						name: "default",
					},
				],
			},
		},
	],
};
