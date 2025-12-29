import { describe, it, expect, beforeEach } from "@rstest/core"
import { S3VersionStorage } from "@infra/storage/s3-version-storage"
import { Version } from "@domain/project-history/version/version"
import { FileArtifacts } from "@domain/project-history/version/file-artifacts"

describe('S3 Version Storage', () => {

    let versionStorage: S3VersionStorage

    const projectHistoryId = 'project-history-id'
    const buildArtifacts = {
        "dist/main.js": "console.log('build');",
        "dist/style.css": "body { background: #fff; }"
    } as FileArtifacts
    const sourceCodeArtifacts = {
        "src/index.ts": "export const handler = () => null;",
        "src/utils/logger.ts": "export const logger = () => null;"
    } as FileArtifacts

    beforeEach(() => {
        versionStorage = new S3VersionStorage('jigjoy-vcs')
    })

    it('should persist build and source artifacts and return a snapshot with generated paths', async () => {
        
        const version : Version = {
            projectHistoryId, 
            buildArtifacts, 
            sourceCodeArtifacts
        }

        const snapshot = await versionStorage.save(version)

        expect(snapshot).toBeDefined()
        expect(snapshot.buildArchivePath).toBeDefined()
        expect(snapshot.sourceCodeArchivePath).toBeDefined()
        expect(snapshot.id).toBeDefined()


    })

    it('should restore a previously saved version from the bucket', async () => {

        const version : Version = {
            projectHistoryId, 
            buildArtifacts, 
            sourceCodeArtifacts
        }

        const snapshot = await versionStorage.save(version)
        const restoredVersion = await versionStorage.restore(projectHistoryId, snapshot)

        expect(restoredVersion.projectHistoryId).toEqual(projectHistoryId)
        expect(restoredVersion.buildArtifacts).toEqual(buildArtifacts)
        expect(restoredVersion.sourceCodeArtifacts).toEqual(sourceCodeArtifacts)
    })

})

