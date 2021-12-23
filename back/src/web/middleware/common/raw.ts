import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as compress from "compression";
import * as methodOverride from "method-override";
import { allowedOrigins } from "../../../config/web";

export const middlewares: any[] = [];

middlewares.push(
	cors({
		origin: allowedOrigins,
		credentials: true,
	}),
	cookieParser(),
	compress({}),
	methodOverride(),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true,
	})
);
