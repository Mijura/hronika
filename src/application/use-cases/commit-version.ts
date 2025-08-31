import { Repository } from "@domain/entities/repositiory"
import { RepositoryStore } from "@domain/ports/repository-store"
import { CommitVersion } from "@domain/use-cases/commit-version"
import { FileArtifacts, FileArtifactsStorage } from "@honeycomb-app/file-artifacts"

export class CommitVersionUseCase implements CommitVersion{

    constructor(
        private readonly repositoryStore: RepositoryStore,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(id: string, fileArtifacts: FileArtifacts): Promise<void> {
        
        try {
            const repository: Repository = await this.repositoryStore.get(id)

            const version = repository.addVersion()

            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            await this.artifactsStorage.upload(bucket, version.artifactPath, fileArtifacts)

            // Save the version
            await this.repositoryStore.save(repository)
        } catch (error) {
            throw new Error(`Error committing version: ${error}`)
        }
    }

}