import { VersionDTO } from "@application/dto/version"
import { ProjectHistory } from "@domain/entities/project-history"
import { VersionSnapshot } from "@domain/entities/version-snapshot"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { SaveVersion } from "@domain/use-cases/save-version"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class SaveVersionUseCase implements SaveVersion {

    constructor(
        private readonly projectHistoryRepository: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(versionDTO: VersionDTO): Promise<void> {
        
        try {

            const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = versionDTO
            const projectHistory: ProjectHistory | null = await this.projectHistoryRepository.get(projectHistoryId)

            if (!projectHistory) {
                throw new NotFoundError('Project history not found')
            }

            // create a snapshot form file artifacts
            const buildFolderPath = `${projectHistoryId}/build`
            const sourceCodeFolderPath = `${projectHistoryId}/source`
            
            const sourceCodePromise = this.artifactsStorage.uploadAsArchive(sourceCodeFolderPath, sourceCodeArtifacts)
            const buildPromise = this.artifactsStorage.uploadAsArchive(buildFolderPath, buildArtifacts)

            const [buildPath, sourceCodePath] = await Promise.all([sourceCodePromise, buildPromise])

            const snapshot = VersionSnapshot.create(buildPath, sourceCodePath)

            // add snapshot and save
            projectHistory.addSnapshot(snapshot)
            await this.projectHistoryRepository.save(projectHistory)
        } catch (error) {
            throw new Error(`Error during saving artifacts version: ${error}`)
        }
    }

}