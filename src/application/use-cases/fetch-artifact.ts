
import { ArtifactDTO } from "@application/dto/create-snapshot"
import { Repository } from "@domain/entities/project-history"
import { Version } from "@domain/entities/project-snapshot"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { RepositoryStore } from "@domain/ports/repository-store"
import { FetchSnapshot } from "@domain/use-cases/fetch-latest-snapshot"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class FetchSnapshotUseCase implements FetchSnapshot {

    constructor(
        private readonly repositoryStore: RepositoryStore,
        private readonly artifactsStorage: FileArtifactsStorage
    ){}
    
    async execute(repositoryId: string): Promise<ArtifactDTO> {
        
        try {
            const repository: Repository | null = await this.repositoryStore.get(repositoryId)

            if (!repository) {
                throw new NotFoundError('Repository not found')
            }

            const version: Version | null = repository.getLatest()
            if (!version) {
                throw new Error('Repository is empty')
            }
            
            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            const [buildArtifact, sourceCodeArtifact] = await Promise.all([
                this.artifactsStorage.download(bucket, version.buildPath),
                this.artifactsStorage.download(bucket, version.sourceCodePath)
            ])

            const artifact: ArtifactDTO = {
                repositoryId: repositoryId, 
                build: buildArtifact,
                sourceCode: sourceCodeArtifact
            }

            return artifact

        } catch (error) {
            throw new Error(`Error pulling artifacts: ${error}`)
        }
    }


}