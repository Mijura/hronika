import { ProjectHistory } from "@domain/entities/project-history"
import { ProjectHistoryRecord } from "@infra/storage/records/project-history"
import { VersionSnapshotMapper } from "@infra/storage/mappers/version-snapshot-mapper"

export class ProjectHistoryMapper {

    /**
     * Converts a ProjectHistory domain entity to a storage record.
     * 
     * @param history - The ProjectHistory domain entity to convert
     * @returns A ProjectHistoryRecord suitable for storage
     */
    static toRecord(history: ProjectHistory): ProjectHistoryRecord {
        return {
            id: history.id,
            snapshots: history.getSnapshots().map(snapshot => VersionSnapshotMapper.toRecord(snapshot)),
            latestSnapshotId: history.getLatestSnapshotId()
        }
    }

    /**
     * Converts a storage record back to a ProjectHistory domain entity.
     * 
     * @param record - The ProjectHistoryRecord from storage
     * @returns A rehydrated ProjectHistory domain entity
     */
    static toDomain(record: ProjectHistoryRecord): ProjectHistory {
        return  ProjectHistory.rehydrate(record)
    }

}