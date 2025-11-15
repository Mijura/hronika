import { ProjectSnapshot } from '@domain/value-objects/project-snapshot'
import { v4 as uuidv4 } from 'uuid'

export class ProjectHistory {

    private snapshots: ProjectSnapshot[]
    private latestSnapshotId: string | null

    private constructor(
        public readonly id: string
    ) {
        this.snapshots = []
        this.latestSnapshotId = null
    }

    static create(): ProjectHistory {
        return new ProjectHistory(uuidv4())
    }

    addSnapshot(): ProjectSnapshot {
        const snapshotId = uuidv4()
        const buildPath = `${this.id}/build/${snapshotId}.tar.gz`
        const sourceCodePath = `${this.id}/source/${snapshotId}.tar.gz`
        const snapshot = new ProjectSnapshot(snapshotId, buildPath, sourceCodePath)
        this.snapshots.push(snapshot)
        this.latestSnapshotId = snapshot.id
        return snapshot
    }

    setLatest(snapshotId: string) {
        const exists = this.snapshots.some(s => s.id === snapshotId)
        if (!exists) throw new Error("Snapshot not found in the project history")
        this.latestSnapshotId = snapshotId
    }

    getLatestSnapshot(): ProjectSnapshot | null {
        if (!this.latestSnapshotId) return null
        return this.snapshots.find(s => s.id === this.latestSnapshotId) ?? null
    }

    getLatestSnapshotId(): string | null {
        return this.latestSnapshotId
    }
    
    getSnapshots(): ReadonlyArray<ProjectSnapshot> {
        return [...this.snapshots]
    }

    static rehydrate(data: {
        id: string
        snapshots: any[]
        latestSnapshotId: string | null
      }): ProjectHistory {
        const history = new ProjectHistory(data.id)
        history.snapshots = data.snapshots.map(s => ProjectSnapshot.rehydrate(s))
        history.latestSnapshotId = data.latestSnapshotId
        return history
      }

}