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

    addSnapshot(snapshot: VersionSnapshot): VersionSnapshot[] {
        this.snapshots.push(snapshot)
        this.latestSnapshotId = snapshot.id
        return this.snapshots
    }

    setLatest(snapshotId: string) {
        const exists = this.snapshots.some(s => s.id === snapshotId)
        if (!exists) throw new VersionSnapshotNotFound(snapshotId)
        this.latestSnapshotId = snapshotId
    }

    getLatestSnapshot(): VersionSnapshot | null {
        if (!this.latestSnapshotId) return null
        return this.snapshots.find(s => s.id === this.latestSnapshotId) ?? null
    }

    getLatestSnapshotId(): string | null {
        return this.latestSnapshotId
    }
    
    getSnapshots(): ReadonlyArray<VersionSnapshot> {
        return [...this.snapshots]
    }

    static create(): ProjectHistory {
        return new ProjectHistory(uuidv4())
    }

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