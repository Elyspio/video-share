import { AuthenticationService } from "../../services/authentication.service";
import { ThemeService } from "../../services/theme.service";
import { LocalStorageService } from "../../services/localStorage.service";
import { DiKeysService } from "./di.keys.service";
import { container } from "../index";
import { VideoService } from "../../services/video.service";
import { RoomService } from "../../services/room.service";

container.bind<AuthenticationService>(DiKeysService.authentication).to(AuthenticationService);

container.bind<VideoService>(DiKeysService.video).to(VideoService);

container.bind<RoomService>(DiKeysService.room).to(RoomService);

container.bind<ThemeService>(DiKeysService.theme).to(ThemeService);

container.bind<LocalStorageService>(DiKeysService.localStorage.settings).toConstantValue(new LocalStorageService("elyspio-authentication-settings"));

container.bind<LocalStorageService>(DiKeysService.localStorage.validation).toConstantValue(new LocalStorageService("elyspio-authentication-validation"));
