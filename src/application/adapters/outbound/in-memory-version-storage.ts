import { VersionStorage } from "@app/ports/outbound/version-storage"
import { Version } from "@app/value-objects/version"
import { VersionSnapshot } from "@domain/project-history/version-snapshot"
import { FileArtifacts } from "@app/value-objects/file-artifacts"

export class InMemoryVerionStorage implements VersionStorage {
    
    private storage: Map<string, FileArtifacts> = new Map()

    async save(version: Version): Promise<VersionSnapshot> {
        const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = version
        
        // Create folder paths similar to S3 version storage
        const buildFolderPath = `${projectHistoryId}/build`
        const sourceCodeFolderPath = `${projectHistoryId}/source`
        
        // Generate archive paths with timestamps
        const timestamp = Date.now()
        const buildArchivePath = `${buildFolderPath}/${timestamp}.archive`
        const sourceCodeArchivePath = `${sourceCodeFolderPath}/${timestamp}.archive`
        
        // Store build artifacts (deep copy)
        const buildArtifactsCopy = new FileArtifacts()
        for (const [filePath, content] of Object.entries(buildArtifacts)) {
            buildArtifactsCopy[filePath] = content
        }
        this.storage.set(buildArchivePath, buildArtifactsCopy)
        
        // Store source code artifacts (deep copy)
        const sourceCodeArtifactsCopy = new FileArtifacts()
        for (const [filePath, content] of Object.entries(sourceCodeArtifacts)) {
            sourceCodeArtifactsCopy[filePath] = content
        }
        this.storage.set(sourceCodeArchivePath, sourceCodeArtifactsCopy)
        
        // Create and return version snapshot
        const snapshot = VersionSnapshot.create(buildArchivePath, sourceCodeArchivePath)
        
        return snapshot
    }

    async restore(projectHistoryId: string, snapshot: VersionSnapshot): Promise<Version> {
        // Retrieve build artifacts from storage
        const buildArtifacts = this.storage.get(snapshot.buildArchivePath)
        if (!buildArtifacts) {
            throw new Error(`Build archive not found at path: ${snapshot.buildArchivePath}`)
        }
        
        // Retrieve source code artifacts from storage
        const sourceCodeArtifacts = this.storage.get(snapshot.sourceCodeArchivePath)
        if (!sourceCodeArtifacts) {
            throw new Error(`Source code archive not found at path: ${snapshot.sourceCodeArchivePath}`)
        }
        
        // Return deep copies of the artifacts
        const buildArtifactsCopy = new FileArtifacts()
        for (const [filePath, content] of Object.entries(buildArtifacts)) {
            buildArtifactsCopy[filePath] = content
        }
        
        const sourceCodeArtifactsCopy = new FileArtifacts()
        for (const [filePath, content] of Object.entries(sourceCodeArtifacts)) {
            sourceCodeArtifactsCopy[filePath] = content
        }
        
        // Reconstruct and return the version
        const version = new Version(
            projectHistoryId,
            buildArtifactsCopy,
            sourceCodeArtifactsCopy
        )
        
        return version
    }
}