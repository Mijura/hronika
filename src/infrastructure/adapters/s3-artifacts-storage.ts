import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { CompressorService } from "@domain/ports/compressor-service"
import { FileArtifacts, FileStorage } from "@jigjoy-io/file-artifacts"
import { Readable } from "stream"

export class S3ArtifactsStorage implements FileArtifactsStorage {
    
    constructor(private readonly fileStorage: FileStorage, private readonly compressorService: CompressorService) {}
    
    async upload(bucket: string, path: string, fileArtifacts: FileArtifacts): Promise<void> {
		const archive = await this.compressorService.compress(fileArtifacts)
		const stream = Readable.from(archive)

		await this.fileStorage.upload(bucket, path, stream)
    }

    async download(bucket: string, archivePath: string): Promise<FileArtifacts> {
        const buffer = await this.fileStorage.download(bucket, archivePath)
		return this.compressorService.decompress(buffer)
    }
}