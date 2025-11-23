import { ProjectHistory } from "@domain/entities/project-history"
import { FileArtifactsStorage } from "@application/ports/outbound/file-artifacts-storage"
import { ProjectHistoryRepository } from "@application/ports/outbound/project-history-repository"
import { VersionSnapshot } from "@domain/entities/version-snapshot"
import { GetLatestVersion } from "@application/ports/inbound/get-latest-version"
import { ProjectHistoryNotFound } from "@application/errors/project-history-not-found"
import { Version } from "@domain/value-objects/version"

export class GetLatestVersionUseCase implements GetLatestVersion {

    constructor(
        private readonly historyRepo: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ){}
    
    /**
     * Retrieves the latest version of a project, including build and source code artifacts.
     * 
     * @param projectHistoryId - The unique identifier of the project history
     * @returns A promise that resolves to the latest version with build and source code artifacts
     * @throws {ProjectHistoryNotFound} If the project history with the given ID does not exist
     * @throws {Error} If the project history is empty or if there's an error pulling artifacts
     */
    async execute(projectHistoryId: string): Promise<Version> {
        
        try {
            const history: ProjectHistory | null = await this.historyRepo.get(projectHistoryId)

            if (!history) {
                throw new ProjectHistoryNotFound(projectHistoryId)
            }

            const versionSnapshot: VersionSnapshot | null = history.getLatestSnapshot()
            if (!versionSnapshot) {
                throw new Error('Project history is empty')
            }

            const [buildArtifacts, sourceCodeArtifacts] = await Promise.all([
                this.artifactsStorage.download(versionSnapshot.buildArchivePath),
                this.artifactsStorage.download(versionSnapshot.sourceCodeArchivePath)
            ])

            const version: Version = {
                projectHistoryId: projectHistoryId, 
                buildArtifacts: buildArtifacts,
                sourceCodeArtifacts: sourceCodeArtifacts
            }

            return version

        } catch (error) {
            throw new Error(`Error pulling artifacts: ${error}`)
        }
    }


}