import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { SaveVersionUseCase } from "@app/ports/use-cases/save-version"
import { Version } from "@domain/project-history/version/version"
import { VersionStorage } from "@app/ports/storage/version-storage"

export class SaveVersion implements SaveVersionUseCase {
	constructor(
		private readonly historyRepo: ProjectHistoryRepository,
		private readonly versionStorage: VersionStorage,
	) {}

	/**
	 * Saves a new version snapshot to the project history by uploading artifacts and creating a snapshot.
	 *
	 * @param version - The version containing project history ID, build artifacts, and source code artifacts
	 * @returns A promise that resolves when the version has been successfully saved
	 * @throws {ProjectHistoryNotFound} If the project history with the given ID does not exist
	 * @throws {Error} If there's an error during the artifact upload or saving process
	 */
	async execute(version: Version): Promise<Version> {
		try {
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
