import { HeaderParams, IMiddleware, Middleware, QueryParams, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Request } from "express";
import { authorization_cookie_token, authorization_header_token } from "../../config/authentication";
import { getLogger } from "../../core/utils/logger";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Inject } from "@tsed/di";

@Middleware()
export class RequireLogin implements IMiddleware {
	private static log = getLogger.middleware(RequireLogin);

	@Inject() authenticationService!: AuthenticationService;

	public async use(@Req() req: Request, @QueryParams("token") token?: string) {
		const exception = new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication/");

		// Sanitize token param
		if (token === "") token = undefined;

		try {
			const cookieAuth = req.cookies[authorization_cookie_token];
			const headerToken = req.headers[authorization_header_token];

			RequireLogin.log.info("RequireLogin", {
				cookieAuth,
				headerToken,
				uriToken: token,
			});

			token = token ?? cookieAuth;
			token = token ?? (headerToken as string);

			if (await this.authenticationService.isAuthenticated(token)) {
				req.auth = {
					user: {
						username: await this.authenticationService.getUsername(token),
						token,
					},
				};
				return true;
			} else throw exception;
		} catch (e) {
			throw exception;
		}
	}
}

@Middleware()
export class RequireAppLogin implements IMiddleware {
	@Inject() authenticationService!: AuthenticationService;

	public async use(@Req() req: Request, @HeaderParams(authorization_header_token) token: string) {
		const exception = new Unauthorized("The token provided is not authorized, see https://elyspio.fr/authentication/");

		try {
			if (await this.authenticationService.isAppAuthenticated(token)) {
				req.auth = {
					app: {
						token,
					},
				};
				return true;
			} else throw exception;
		} catch (e) {
			throw exception;
		}
	}
}

declare global {
	namespace Express {
		interface Request {
			auth: {
				user?: {
					username: string;
					token: string;
				};
				app?: {
					token: string;
				};
			};
		}
	}
}
