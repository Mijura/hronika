import { ArtifactsDTO } from "@application/dto/artifacts"
import { ProjectHistory } from "@domain/entities/project-history"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { FetchProjectArtifacts } from "@domain/use-cases/fetch-project-artifacts"
import { ProjectSnapshot } from "@domain/value-objects/project-snapshot"
import { NotFoundError } from "@jigjoy-io/serverless-core"

export class FetchProjectArtifactsUseCase implements FetchProjectArtifacts {

    constructor(
        private readonly projectHistoryRepository: ProjectHistoryRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ){}
    
    async execute(projectHistoryId: string): Promise<ArtifactsDTO> {
        
        try {
            const history: ProjectHistory | null = await this.projectHistoryRepository.get(projectHistoryId)

            if (!history) {
                throw new NotFoundError('Repository not found')
            }

            const projectSnapshot: ProjectSnapshot | null = history.getLatestSnapshot()
            if (!projectSnapshot) {
                throw new Error('Project history is empty')
            }
            
            const bucket = process.env.VERSION_CONTROL_BUCKET
            if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

            const [buildArtifacts, sourceCodeArtifacts] = await Promise.all([
                this.artifactsStorage.download(bucket, projectSnapshot.buildPath),
                this.artifactsStorage.download(bucket, projectSnapshot.sourceCodePath)
            ])

            const artifacts: ArtifactsDTO = {
                projectHistoryId: projectHistoryId, 
                buildArtifacts: buildArtifacts,
                sourceCodeArtifacts: sourceCodeArtifacts
            }

            return artifacts

        } catch (error) {
            throw new Error(`Error pulling artifacts: ${error}`)
        }
    }


}