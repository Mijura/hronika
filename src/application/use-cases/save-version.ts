import { ProjectHistory } from "@domain/entities/project-history"
import { VersionSnapshot } from "@domain/entities/version-snapshot"
import { ProjectHistoryNotFoundError } from "@domain/errors/project-history-not-found-error"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { SaveVersion } from "@domain/use-cases/save-version"
import { Version } from "@domain/value-objects/version"

export class SaveVersionUseCase implements SaveVersion {

    constructor(
        private readonly projectHistoryRepository: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(version: Version): Promise<void> {
        
        try {

            const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = version
            const projectHistory: ProjectHistory | null = await this.projectHistoryRepository.get(projectHistoryId)

            if (!projectHistory) {
                throw new ProjectHistoryNotFoundError(projectHistoryId)
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