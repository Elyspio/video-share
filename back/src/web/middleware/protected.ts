import { In, JsonParameterTypes, Returns } from "@tsed/schema";
import { UseAuth } from "@tsed/common";
import { useDecorators } from "@tsed/core";
import { authorization_cookie_token, authorization_header_token } from "../../config/authentication";
import { RequireAppLogin, RequireLogin } from "./authentication";
import { Unauthorized } from "@tsed/exceptions";

export function Protected(): Function {
	return useDecorators(
		UseAuth(RequireLogin),
		In(JsonParameterTypes.HEADER).Name(authorization_header_token).Type(String).Required(false),
		In(JsonParameterTypes.BODY).Name(authorization_header_token).Type(String).Required(false),
		In(JsonParameterTypes.COOKIES).Name(authorization_cookie_token).Type(String).Required(false),
		Returns(401, Unauthorized).Description("You are not logged")
	);
}

export function FromApp(): Function {
	return useDecorators(
		UseAuth(RequireAppLogin),
		In(JsonParameterTypes.COOKIES).Name(authorization_cookie_token).Type(String).Required(false),
		Returns(401, Unauthorized).Description("App not authorized")
	);
}
