import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryRecord } from "@infra/storage/records/project-history"
import { VersionSnapshotMapper } from "@infra/storage/mappers/version-snapshot-mapper"

export class ProjectHistoryMapper {
	static toRecord(history: ProjectHistory): ProjectHistoryRecord {
		return {
			id: history.id,
			snapshots: history.getSnapshots().map((snapshot) => VersionSnapshotMapper.toRecord(snapshot)),
			latestSnapshotId: history.getLatestSnapshotId(),
		}
	}

	static toDomain(record: ProjectHistoryRecord): ProjectHistory {
		return ProjectHistory.rehydrate(record)
	}
}
