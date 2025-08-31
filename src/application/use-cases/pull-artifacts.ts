
import { VersionRepository } from "@domain/ports/version-repository"
import { PullArtifacts } from "@domain/use-cases/pull-artifacts"
import { FileArtifacts, FileArtifactsStorage } from "@honeycomb-app/file-artifacts"

export class PullArtifactsUseCase implements PullArtifacts {

    constructor(
        private readonly versionRepository: VersionRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ){}
    
    async execute(versionId: string): Promise<FileArtifacts> {
        
        const version = await this.versionRepository.get(versionId)
        if (!version) {
            throw new Error(`Version ${versionId} not found`)
        }
        
		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

		return await this.artifactsStorage.download(bucket, version.artifactPath)
    }


}