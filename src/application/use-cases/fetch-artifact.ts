
import { ArtifactDTO } from "@application/dto/artifact"
import { Repository } from "@domain/entities/repositiory"
import { Version } from "@domain/entities/version"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { RepositoryStore } from "@domain/ports/repository-store"
import { FetchArtifact } from "@domain/use-cases/fetch-artifact"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class FetchArtifactUseCase implements FetchArtifact {

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