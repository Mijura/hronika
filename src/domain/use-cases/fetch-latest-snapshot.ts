import { SnapshotDTO } from "@application/dto/create-snapshot"

export interface FetchLatestSnapshot {
    execute(projectHistoryId: string): Promise<SnapshotDTO>
}