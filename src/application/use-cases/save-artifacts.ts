import { ArtifactsDTO } from "@application/dto/artifacts"
import { ProjectHistory } from "@domain/entities/project-history"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { SaveArtifacts } from "@domain/use-cases/save-artifacts"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class SaveArtifactsUseCase implements SaveArtifacts {

    constructor(
        private readonly projectHistoryRepository: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(artifactsDto: ArtifactsDTO): Promise<void> {
        
        try {

            const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = artifactsDto
            const projectHistory: ProjectHistory | null = await this.projectHistoryRepository.get(projectHistoryId)

            if (!projectHistory) {
                throw new NotFoundError('Project history not found')
            }

            const snapshot = projectHistory.addSnapshot()

            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            const sourceCodePromise = this.artifactsStorage.upload(bucket, snapshot.sourceCodePath, sourceCodeArtifacts)
            const buildPromise = this.artifactsStorage.upload(bucket, snapshot.buildPath, buildArtifacts)

            await Promise.all([sourceCodePromise, buildPromise])

            // Update the history
            await this.projectHistoryRepository.save(projectHistory)
        } catch (error) {
            throw new Error(`Error during saving artifacts version: ${error}`)
        }
    }

}