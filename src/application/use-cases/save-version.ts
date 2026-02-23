import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { SaveVersionParams, SaveVersionUseCase } from "@app/ports/use-cases/save-version"
import { Version } from "@domain/project-history/version/version"
import { VersionStorage } from "@app/ports/storage/version-storage"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export class SaveVersion implements SaveVersionUseCase {
	constructor(
		private readonly historyRepo: ProjectHistoryRepository,
		private readonly versionStorage: VersionStorage,
	) {}

	async execute(auth: Auth<UserData>, params: SaveVersionParams): Promise<Version> {
		try {

			const { version } = params
			console.log(`Auth data: ${JSON.stringify(auth)}`)
			
			const projectHistoryId = version.projectHistoryId
			const projectHistory: ProjectHistory | null = await this.historyRepo.get(projectHistoryId)

			if (!projectHistory) {
				throw new ProjectHistoryNotFound(projectHistoryId)
			}

			const snapshot = await this.versionStorage.save(version)

			projectHistory.addSnapshot(snapshot)
			await this.historyRepo.save(projectHistory)

			return version
		} catch (error) {
			throw new Error(`Error during saving artifacts version: ${error}`)
		}
	}
}
