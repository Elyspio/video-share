import { Log } from "../utils/decorators/logger";
import { getLogger } from "../utils/logger";
import { AuthenticationApiClient } from "../apis/authentication";
import { Inject } from "@tsed/di";
import { Service } from "@tsed/common";

@Service()
export class AuthenticationService {
	private static log = getLogger.service(AuthenticationService);

	@Inject()
	private authenticationApi!: AuthenticationApiClient;

	@Log(AuthenticationService.log)
	public async isAuthenticated(token: string) {
		return this.authenticationApi.clients.connection.validToken(token).then((x) => x.data);
	}

	@Log(AuthenticationService.log)
	public async isAppAuthenticated(token: string) {
		return this.authenticationApi.clients.appConnection.validToken("TODO:REPLACE_IF_NEEDED", { token }).then((x) => x.data);
	}

	@Log(AuthenticationService.log)
	public async getUsername(token: string) {
		return this.authenticationApi.clients.user.getUserInfo("username", token, token).then((x) => x.data);
	}
}
