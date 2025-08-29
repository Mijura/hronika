import { Version } from "@domain/value-objects/version"
import { CompressorService } from "@domain/ports/compressor-service"
import { VersionControlSystem } from "@domain/ports/version-control-system"
import { Readable } from "stream"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { FileStorage } from "@infrastructure/ports/file-storage"

export class S3VersionControlSystem implements VersionControlSystem {
	constructor(
		private readonly fileStorage: FileStorage,
		private readonly compressorService: CompressorService
	) {}


	async pullSourceCode(version: Version): Promise<FileArtifacts> {
		return this.pull(version.sourceCodeUrl)
	}

	async pullBuildArtifact(version: Version): Promise<FileArtifacts> {
		return this.pull(version.buildArtifactUrl)
	}


	private async pull(archiveUrl: string): Promise<FileArtifacts> {
		const bucket = process.env.VERSION_CONTROL_BUCKET
		if (!bucket) throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

		const buffer = await this.fileStorage.download(bucket, archiveUrl)
		return this.compressorService.decompress(buffer)
	}

}
