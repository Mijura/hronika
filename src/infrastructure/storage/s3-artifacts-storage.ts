
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"
import { S3StorageFactory, Storage } from "@jigjoy-io/file-artifacts"

export class S3Storage implements FileArtifactsStorage {
    
    storage: Storage

    constructor(bucket: string) {
        const factory = new S3StorageFactory(bucket)
        this.storage = factory.create()
    }
    
    /**
     * Uploads file artifacts as an archive to S3 storage.
     * 
     * @param path - The S3 path where the archive should be stored
     * @param fileArtifacts - The file artifacts to upload as an archive
     * @returns A promise that resolves to the S3 path of the uploaded archive
     */
	async uploadAsArchive(path: string, fileArtifacts: FileArtifacts): Promise<string> {
		return this.storage.writeArchive(path, fileArtifacts)
    }

    /**
     * Downloads and extracts file artifacts from an archive stored in S3.
     * 
     * @param archivePath - The S3 path to the archive
     * @returns A promise that resolves to the extracted file artifacts
     */
    async download(archivePath: string): Promise<FileArtifacts> {
        return this.storage.readArchive(archivePath)
    }
}