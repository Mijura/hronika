
import { VersionRepository } from "@domain/ports/version-repository"
import { PullSourceCode } from "@domain/use-cases/pull-source-code"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export class PullSourceCodeUseCase implements PullSourceCode {

    constructor(
        private readonly versionRepository: VersionRepository,
        private readonly fileStorage: FileStorage,
        private readonly compressorService: CompressorService
    ){}
    
    async execute(versionId: string): Promise<FileArtifacts> {
        const version = await this.versionRepository.get(versionId)
        if (!version) {
            throw new Error(`Version ${versionId} not found`)
        }
        return this.pull(version.sourceCodeUrl)
    }

    private async pull(archiveUrl: string): Promise<FileArtifacts> {
		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

		const buffer = await this.fileStorage.download(bucket, archiveUrl)
		return this.compressorService.decompress(buffer)
	}

}