
export interface ProjectHistoryRecord {
    id: string
    snapshots: ProjectSnapshotRecord[]
    latestSnapshotId: string | null
}