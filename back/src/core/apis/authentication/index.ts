import { Service } from "@tsed/common";
import { AuthenticationApi, AuthenticationAppApi, UsersApi, UsersCredentialsApi } from "./generated";
import axios from "axios";
import { authorization_server_url } from "../../../config/authentication";

const instance = axios.create({
	withCredentials: true,
});

@Service()
export class AuthenticationApiClient {
	public readonly clients: {
		connection: AuthenticationApi;
		user: UsersApi;
		credentials: UsersCredentialsApi;
		appConnection: AuthenticationAppApi;
	};

	constructor() {
		this.clients = {
			connection: new AuthenticationApi(undefined, authorization_server_url, instance),
			user: new UsersApi(undefined, authorization_server_url, instance),
			credentials: new UsersCredentialsApi(undefined, authorization_server_url, instance),
			appConnection: new AuthenticationAppApi(undefined, authorization_server_url, instance),
		};
	}
}
