import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface FileArtifactsStorage {

    /**
     * 
     * @param folderName 
     * @param fileArtifacts 
     * @returns
     */
    save(folderName: string, fileArtifacts: FileArtifacts): Promise<string>
    
    /**
     * 
     * @param archivePath 
     * @returns 
     */
    get(archivePath: string): Promise<FileArtifacts>
}