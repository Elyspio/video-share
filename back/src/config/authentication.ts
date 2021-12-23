import { env } from "process";

export const authorization_cookie_token = "authentication-token";
export const authorization_header_token = "authentication-token";
export const authorization_server_url = env.AUTHENTICATION_SERVER_URI ?? "http://localhost/authentication";
