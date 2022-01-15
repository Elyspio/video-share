import { DiKeysApi } from "./di.keys.api";
import { RoomClient, VideoClient } from "../../apis/backend";
import { AuthenticationApiClient } from "../../apis/authentication";
import { container } from "../index";

container.bind<VideoClient>(DiKeysApi.video).to(VideoClient);
container.bind<RoomClient>(DiKeysApi.room).to(RoomClient);

container.bind<AuthenticationApiClient>(DiKeysApi.authentication).to(AuthenticationApiClient);
