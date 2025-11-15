import { ArtifactDTO } from "@application/dto/create-snapshot"
import { ProjectHistory } from "@domain/entities/project-history"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { RepositoryStore } from "@domain/ports/repository-store"
import { SaveArtifact } from "@domain/use-cases/create-snapshot"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class SaveArtifactUseCase implements SaveArtifact {

    constructor(
        private readonly repositoryStore: RepositoryStore,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(artifact: ArtifactDTO): Promise<void> {
        
        try {
            const projectHistory: ProjectHistory | null = await this.repositoryStore.get(artifact.repositoryId)

            if (!projectHistory) {
                throw new NotFoundError('Repository not found')
            }

            const snapshot = projectHistory.addSnapshot()

            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            const sourcePromise = this.artifactsStorage.upload(bucket, snapshot.sourceCodePath, artifact.build)
            const artifactPromise = this.artifactsStorage.upload(bucket, snapshot.buildPath, artifact.sourceCode)

            await Promise.all([sourcePromise, artifactPromise])

            // Update the history
            await this.repositoryStore.save(projectHistory)
        } catch (error) {
            throw new Error(`Error committing version: ${error}`)
        }
    }

}