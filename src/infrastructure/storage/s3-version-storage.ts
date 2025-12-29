import { VersionStorage } from "@app/ports/storage/version-storage"
import { VersionSnapshot } from "@domain/project-history/version-snapshot"
import { Version } from "@app/value-objects/version"
import { S3StorageFactory, Storage } from "@jigjoy-io/file-artifacts"

export class S3VersionStorage implements VersionStorage {
    

    s3Storage: Storage

    constructor(bucket: string) {
        const factory = new S3StorageFactory(bucket)
        this.s3Storage = factory.create()
    }
    
    async save(version: Version): Promise<VersionSnapshot> {
        
        const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = version
        // create a snapshot form file artifacts
        const buildFolderPath = `${projectHistoryId}/build`
        const sourceCodeFolderPath = `${projectHistoryId}/source`
                    
        const sourceCodePromise = this.s3Storage.writeArchive(sourceCodeFolderPath, sourceCodeArtifacts)
        const buildPromise = this.s3Storage.writeArchive(buildFolderPath, buildArtifacts)
        
        const [sourceCodePath, buildPath] = await Promise.all([sourceCodePromise, buildPromise])
        
        // add version snapshot
        const snapshot = VersionSnapshot.create(buildPath, sourceCodePath)

        return snapshot
    }

    async restore(projectHistoryId: string, snapshot: VersionSnapshot): Promise<Version> {
        
        const [buildArtifacts, sourceCodeArtifacts] = await Promise.all([
            this.s3Storage.readArchive(snapshot.buildArchivePath),
            this.s3Storage.readArchive(snapshot.sourceCodeArchivePath)
        ])

        const version: Version = {
            projectHistoryId: projectHistoryId, 
            buildArtifacts: buildArtifacts,
            sourceCodeArtifacts: sourceCodeArtifacts
        }

        return version
    }
}