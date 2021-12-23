import { inject, injectable } from "inversify";
import { ExampleApiClient } from "../apis/backend";
import { DiKeysApi } from "../di/apis/di.keys.api";

@injectable()
export class ExampleService {
	@inject(DiKeysApi.example)
	private runnerApi!: ExampleApiClient;

	public getContent = async () => {
		return (await this.runnerApi.client.get()).data;
	};

	public getAdminContent = async () => {
		return (await this.runnerApi.client.getAdmin()).data;
	};
}
