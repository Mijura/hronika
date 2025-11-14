
import { Repository } from "@domain/entities/repositiory"
import { Version } from "@domain/entities/version"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { RepositoryStore } from "@domain/ports/repository-store"
import { PullArtifacts } from "@domain/use-cases/pull-artifacts"
import { FileArtifacts } from "@jigjoy-io/file-artifacts"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class PullArtifactsUseCase implements PullArtifacts {

    constructor(
        private readonly repositoryStore: RepositoryStore,
        private readonly artifactsStorage: FileArtifactsStorage
    ){}
    
    async execute(repositoryId: string): Promise<FileArtifacts> {
        
        try {
            const repository: Repository | null = await this.repositoryStore.get(repositoryId)

            if (!repository) {
                throw new NotFoundError('Repository not found')
            }

            const version: Version | null = repository.getCurrentVersion()
            if (!version) {
                throw new Error('Repository is empty')
            }
            
            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            return await this.artifactsStorage.download(bucket, version.artifactPath)
        } catch (error) {
            throw new Error(`Error pulling artifacts: ${error}`)
        }
    }


}