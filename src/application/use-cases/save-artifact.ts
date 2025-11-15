import { ArtifactDTO } from "@application/dto/artifact"
import { Repository } from "@domain/entities/repositiory"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { RepositoryStore } from "@domain/ports/repository-store"
import { SaveArtifact } from "@domain/use-cases/save-artifact"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class SaveArtifactUseCase implements SaveArtifact {

    constructor(
        private readonly repositoryStore: RepositoryStore,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(artifact: ArtifactDTO): Promise<void> {
        
        try {
            const repository: Repository | null = await this.repositoryStore.get(artifact.repositoryId)

            if (!repository) {
                throw new NotFoundError('Repository not found')
            }

            const version = repository.addVersion()

            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            const sourcePromise = this.artifactsStorage.upload(bucket, version.sourceCodePath, artifact.build)
            const artifactPromise = this.artifactsStorage.upload(bucket, version.buildPath, artifact.sourceCode)

            await Promise.all([sourcePromise, artifactPromise])

            // Save the version
            await this.repositoryStore.save(repository)
        } catch (error) {
            throw new Error(`Error committing version: ${error}`)
        }
    }

}