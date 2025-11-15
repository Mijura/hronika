import { SnapshotDTO } from "@application/dto/create-snapshot"

export interface CreateSnapshot {
    execute(snapshot: SnapshotDTO): Promise<void>
}