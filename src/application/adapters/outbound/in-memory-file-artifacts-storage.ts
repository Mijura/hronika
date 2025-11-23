import { FileArtifactsStorage } from "@application/ports/outbound/file-artifacts-storage"
import { FileArtifacts } from "@application/value-objects/file-artifacts"

export class InMemoryFileArtifactsStorage implements FileArtifactsStorage {
    
    private storage: Map<string, FileArtifacts> = new Map()

    async uploadAsArchive(folderName: string, fileArtifacts: FileArtifacts): Promise<string> {
        const timestamp = Date.now()
        const archivePath = `${folderName}/${timestamp}.archive`
        
        // Create a deep copy of the file artifacts to store
        const artifactsCopy = new FileArtifacts()
        for (const [filePath, content] of Object.entries(fileArtifacts)) {
            artifactsCopy[filePath] = content
        }
        
        this.storage.set(archivePath, artifactsCopy)
        return archivePath
    }

    async download(archivePath: string): Promise<FileArtifacts> {
        const artifacts = this.storage.get(archivePath)
        
        if (!artifacts) {
            throw new Error(`Archive not found at path: ${archivePath}`)
        }
        
        // Return a deep copy of the stored artifacts
        const artifactsCopy = new FileArtifacts()
        for (const [filePath, content] of Object.entries(artifacts)) {
            artifactsCopy[filePath] = content
        }
        
        return artifactsCopy
    }
}