
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { S3StorageFactory, Storage } from "@jigjoy-io/file-artifacts"

export class S3Storage implements FileArtifactsStorage {
    
    storage: Storage

    constructor(bucket: string) {
        const factory = new S3StorageFactory(bucket)
        this.storage = factory.create()
    }
    
	async save(path: string, fileArtifacts: FileArtifacts): Promise<string> {
		return this.storage.writeArchive(path, fileArtifacts)
    }

    async get(archivePath: string): Promise<FileArtifacts> {
        return this.storage.readArchive(archivePath)
    }
}