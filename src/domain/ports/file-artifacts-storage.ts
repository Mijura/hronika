import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface FileArtifactsStorage {

    /**
     * Uploads file artifacts as an archive to the storage system.
     * 
     * @param folderName - The folder path where the archive should be stored
     * @param fileArtifacts - The file artifacts to upload as an archive
     * @returns A promise that resolves to the path of the uploaded archive
     */
    uploadAsArchive(folderName: string, fileArtifacts: FileArtifacts): Promise<string>
    
    /**
     * Downloads and extracts file artifacts from an archive stored in the storage system.
     * 
     * @param archivePath - The path to the archive in the storage system
     * @returns A promise that resolves to the extracted file artifacts
     */
    download(archivePath: string): Promise<FileArtifacts>
}