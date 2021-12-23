import { DiKeysApi } from "./di.keys.api";
import { ExampleApiClient } from "../../apis/backend";
import { AuthenticationApiClient } from "../../apis/authentication";
import { container } from "../index";

container.bind<ExampleApiClient>(DiKeysApi.example).to(ExampleApiClient);

container.bind<AuthenticationApiClient>(DiKeysApi.authentication).to(AuthenticationApiClient);
