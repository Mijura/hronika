import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface FileArtifactsStorage {

    /**
     * 
     * @param folderName 
     * @param fileArtifacts 
     * @returns
     */
    uploadAsArchive(folderName: string, fileArtifacts: FileArtifacts): Promise<string>
    
    /**
     * 
     * @param archivePath 
     * @returns 
     */
    download(archivePath: string): Promise<FileArtifacts>
}