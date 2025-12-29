export class VersionSnapshotNotFound extends Error {

    constructor(snapshotId: string){
        super(`Version snapshot not found: ${snapshotId}`)
        this.name = `VersionSnaphostNotFoundError`
    }
}