import { ProjectHistory } from "@domain/entities/project-history"
import { ProjectHistoryRecord } from "@infrastructure/records/project-history"
import { ProjectSnapshotMapper } from "./project-snapshot-mapper"

export class ProjectHistoryMapper {

    static toRecord(history: ProjectHistory): ProjectHistoryRecord {
        return {
            id: history.id,
            snapshots: history.getSnapshots().map(snapshot => ProjectSnapshotMapper.toRecord(snapshot)),
            latestSnapshotId: history.getLatestSnapshotId()
        }
    }

    static toDomain(record: ProjectHistoryRecord): ProjectHistory {
        return  ProjectHistory.rehydrate(record)
    }

}