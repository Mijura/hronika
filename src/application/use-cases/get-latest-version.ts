import { ProjectHistory } from "@domain/entities/project-history"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { VersionSnapshot } from "@domain/entities/version-snapshot"
import { GetLatestVersion } from "@domain/use-cases/get-latest-version"
import { VersionDTO } from "@application/dto/version"
import { ProjectHistoryNotFoundError } from "@domain/errors/project-history-not-found-error"

export class GetLatestVersionUseCase implements GetLatestVersion {

    constructor(
        private readonly historyRepo: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ){}
    
    async execute(projectHistoryId: string): Promise<VersionDTO> {
        
        try {
            const history: ProjectHistory | null = await this.historyRepo.get(projectHistoryId)

            if (!history) {
                throw new ProjectHistoryNotFoundError(projectHistoryId)
            }

            const versionSnapshot: VersionSnapshot | null = history.getLatestSnapshot()
            if (!versionSnapshot) {
                throw new Error('Project history is empty')
            }

            const [buildArtifacts, sourceCodeArtifacts] = await Promise.all([
                this.artifactsStorage.download(versionSnapshot.buildPath),
                this.artifactsStorage.download(versionSnapshot.sourceCodePath)
            ])

            const version: VersionDTO = {
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