import { VersionSnapshot } from '@domain/entities/version-snapshot'
import { VersionSnapshotNotFound } from '@domain/errors/version-snapshot-not-found'
import { v4 as uuidv4 } from 'uuid'

export class ProjectHistory {

    private snapshots: VersionSnapshot[]
    private latestSnapshotId: string | null

    private constructor(
        public readonly id: string
    ) {
        this.snapshots = []
        this.latestSnapshotId = null
    }

    /**
     * Adds a new version snapshot to the project history and sets it as the latest.
     * 
     * @param snapshot - The version snapshot to add
     * @returns The updated array of all snapshots
     */
    addSnapshot(snapshot: VersionSnapshot): VersionSnapshot[] {
        this.snapshots.push(snapshot)
        this.latestSnapshotId = snapshot.id
        return this.snapshots
    }

    /**
     * Sets a specific snapshot as the latest snapshot by its ID.
     * 
     * @param snapshotId - The unique identifier of the snapshot to set as latest
     * @throws {VersionSnapshotNotFound} If the snapshot with the given ID does not exist
     */
    setLatest(snapshotId: string) {
        const exists = this.snapshots.some(s => s.id === snapshotId)
        if (!exists) throw new VersionSnapshotNotFound(snapshotId)
        this.latestSnapshotId = snapshotId
    }

    /**
     * Retrieves the latest version snapshot from the project history.
     * 
     * @returns The latest version snapshot, or null if no snapshots exist
     */
    getLatestSnapshot(): VersionSnapshot | null {
        if (!this.latestSnapshotId) return null
        return this.snapshots.find(s => s.id === this.latestSnapshotId) ?? null
    }

    /**
     * Gets the ID of the latest snapshot.
     * 
     * @returns The ID of the latest snapshot, or null if no snapshots exist
     */
    getLatestSnapshotId(): string | null {
        return this.latestSnapshotId
    }
    
    /**
     * Gets a read-only copy of all snapshots in the project history.
     * 
     * @returns A read-only array of all version snapshots
     */
    getSnapshots(): ReadonlyArray<VersionSnapshot> {
        return [...this.snapshots]
    }

    /**
     * Creates a new project history instance with a generated unique identifier.
     * 
     * @returns A new ProjectHistory instance
     */
    static create(): ProjectHistory {
        return new ProjectHistory(uuidv4())
    }

    /**
     * Rehydrates a project history entity from persisted data.
     * 
     * @param data - The persisted data containing id, snapshots, and latestSnapshotId
     * @returns A rehydrated ProjectHistory instance
     */
    static rehydrate(data: {
        id: string
        snapshots: any[]
        latestSnapshotId: string | null
      }): ProjectHistory {
        const history = new ProjectHistory(data.id)
        history.snapshots = data.snapshots.map(s => VersionSnapshot.rehydrate(s))
        history.latestSnapshotId = data.latestSnapshotId
        return history
      }

}