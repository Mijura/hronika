import { ProjectHistory } from "@domain/entities/project-history"
import { VersionSnapshot } from "@domain/entities/version-snapshot"
import { ProjectHistoryNotFound } from "@domain/errors/project-history-not-found"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { SaveVersion } from "@domain/use-cases/save-version"
import { Version } from "@domain/value-objects/version"

export class SaveVersionUseCase implements SaveVersion {

    constructor(
        private readonly projectHistoryRepository: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    /**
     * Saves a new version snapshot to the project history by uploading artifacts and creating a snapshot.
     * 
     * @param version - The version containing project history ID, build artifacts, and source code artifacts
     * @returns A promise that resolves when the version has been successfully saved
     * @throws {ProjectHistoryNotFound} If the project history with the given ID does not exist
     * @throws {Error} If there's an error during the artifact upload or saving process
     */
    async execute(version: Version): Promise<void> {
        
        try {

            const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = version
            const projectHistory: ProjectHistory | null = await this.projectHistoryRepository.get(projectHistoryId)

            if (!projectHistory) {
                throw new ProjectHistoryNotFound(projectHistoryId)
            }

            // create a snapshot form file artifacts
            const buildFolderPath = `${projectHistoryId}/build`
            const sourceCodeFolderPath = `${projectHistoryId}/source`
            
            const sourceCodePromise = this.artifactsStorage.uploadAsArchive(sourceCodeFolderPath, sourceCodeArtifacts)
            const buildPromise = this.artifactsStorage.uploadAsArchive(buildFolderPath, buildArtifacts)

            const [buildPath, sourceCodePath] = await Promise.all([sourceCodePromise, buildPromise])

            // add version snapshot
            const snapshot = VersionSnapshot.create(buildPath, sourceCodePath)
            projectHistory.addSnapshot(snapshot)
            await this.projectHistoryRepository.save(projectHistory)
        } catch (error) {
            throw new Error(`Error during saving artifacts version: ${error}`)
        }
    }

}