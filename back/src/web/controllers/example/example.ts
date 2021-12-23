import { Controller, Get, UseBefore } from "@tsed/common";
import { RequireLogin } from "../../middleware/authentication";
import { Returns } from "@tsed/schema";
import { Log } from "../../../core/utils/decorators/logger";
import { getLogger } from "../../../core/utils/logger";

@Controller("/test")
export class Example {
	private static log = getLogger.controller(Example);

	@Get("/")
	@(Returns(200, String).ContentType("text/plain"))
	@Log(Example.log)
	async get() {
		return "Content that does not require authentication";
	}

	@Get("/admin")
	@UseBefore(RequireLogin)
	@Returns(403)
	@(Returns(200, String).ContentType("text/plain"))
	@Log(Example.log)
	async getAdmin() {
		return "Admin content";
	}
}
