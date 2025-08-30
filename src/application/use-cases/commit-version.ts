import { Version } from "@domain/entities/version"
import { VersionRepository } from "@domain/ports/version-repository"
import { CommitVersion } from "@domain/use-cases/commit-version"
import { FileArtifacts, FileArtifactsStorage } from "@honeycomb-app/file-artifacts"

export class CommitVersionUseCase implements CommitVersion{

    constructor(
        private readonly versionRepository: VersionRepository,
        private readonly artifactsStorage: FileArtifactsStorage
    ) {}

    async execute(projectId: string, fileArtifacts: FileArtifacts): Promise<void> {
        
        const version = Version.create(projectId)

		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

        await this.artifactsStorage.upload(bucket, version.artifactPath, fileArtifacts)

		// Save the version
		await this.versionRepository.save(version)
    }

}