
export interface ProjectHistoryRecord {
    id: string
    snapshots: VersionSnapshotRecord[]
    latestSnapshotId: string | null
}