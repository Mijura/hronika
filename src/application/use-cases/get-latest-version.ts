import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { VersionSnapshot } from "@domain/project-history/version/version-snapshot"
import { GetLatestVersionParams, GetLatestVersionUseCase } from "@app/ports/use-cases/get-latest-version"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"
import { Version } from "@domain/project-history/version/version"
import { VersionStorage } from "@app/ports/storage/version-storage"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class GetLatestVersion implements GetLatestVersionUseCase {
	constructor(
		private readonly historyRepo: ProjectHistoryRepository,
		private readonly versionStorage: VersionStorage,
	) {}


	async execute(auth: Auth<UserData>, params: GetLatestVersionParams): Promise<Version> {
		try {

			console.log(`Auth data: ${JSON.stringify(auth)}`)

			const { projectHistoryId } = params
			const history: ProjectHistory | null = await this.historyRepo.get(projectHistoryId)

			if (!history) {
				throw new ProjectHistoryNotFound(projectHistoryId)
			}

			const snapshot: VersionSnapshot | null = history.getLatestSnapshot()
			if (!snapshot) {
				throw new Error("Project history is empty")
			}

			const version: Version = await this.versionStorage.restore(projectHistoryId, snapshot)

			return version
		} catch (error) {
			throw new Error(`Error pulling artifacts: ${error}`)
		}
	}
}
