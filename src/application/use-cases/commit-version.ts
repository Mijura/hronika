import { Version } from "@domain/entities/version"
import { VersionRepository } from "@domain/ports/version-repository"
import { CommitVersion } from "@domain/use-cases/commit-version"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { v4 as uuidv4 } from 'uuid'
import { Readable } from "stream"

export class CommitVersionUseCase implements CommitVersion{

    constructor(
        private readonly compressorService: CompressorService,
        private readonly fileStorage: FileStorage,
        private readonly versionRepository: VersionRepository
    ) {}

    async execute(projectId: string, sourceCodeArtifacts: FileArtifacts, buildArtifacts: FileArtifacts): Promise<void> {
        
        const versionTag = uuidv4()
		const sourceCodePath = `${projectId}/sourceCode/${versionTag}.tar.gz`
		const buildArtifactPath = `${projectId}/buildArtifact/${versionTag}.tar.gz`

		await this.push(buildArtifactPath, buildArtifacts)
		await this.push(sourceCodePath, sourceCodeArtifacts)

		// Save the version
		const version = Version.create(projectId, buildArtifactPath, sourceCodePath)
		await this.versionRepository.save(version)
    }

    private async push(archivePath: string, fileArtifacts: FileArtifacts): Promise<void> {
		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

		const archive = await this.compressorService.compress(fileArtifacts)
		const stream = Readable.from(archive)

		await this.fileStorage.upload(bucket, archivePath, stream)
	}

}