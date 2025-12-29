import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { VersionSnapshot } from "@domain/project-history/version/version-snapshot"
import { GetLatestVersion } from "@app/ports/use-cases/get-latest-version"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"
import { Version } from "@domain/project-history/version/version"
import { VersionStorage } from "@app/ports/storage/version-storage"
import { VersionDTO } from "@app/dto/version"
import { VersionMapper } from "@app/mappers/version"

export class GetLatestVersionUseCase implements GetLatestVersion {

    constructor(
        private readonly historyRepo: ProjectHistoryRepository,
        private readonly versionStorage: VersionStorage
    ){}
    
    /**
     * Retrieves the latest version of a project, including build and source code artifacts.
     * 
     * @param projectHistoryId - The unique identifier of the project history
     * @returns A promise that resolves to the latest version with build and source code artifacts
     * @throws {ProjectHistoryNotFound} If the project history with the given ID does not exist
     * @throws {Error} If the project history is empty or if there's an error pulling artifacts
     */
    async execute(projectHistoryId: string): Promise<VersionDTO> {
        
        try {
            const history: ProjectHistory | null = await this.historyRepo.get(projectHistoryId)

            if (!history) {
                throw new ProjectHistoryNotFound(projectHistoryId)
            }

            const snapshot: VersionSnapshot | null = history.getLatestSnapshot()
            if (!snapshot) {
                throw new Error('Project history is empty')
            }

            const version: Version = await this.versionStorage.restore(projectHistoryId, snapshot)

            return VersionMapper.toDTO(version)

        } catch (error) {
            throw new Error(`Error pulling artifacts: ${error}`)
        }
    }


}