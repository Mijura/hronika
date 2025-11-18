import { VersionSnapshot } from "@domain/entities/version-snapshot"

export class VersionSnapshotMapper {

    /** Converts a VersionSnapshot to a raw DTO */
	static toRecord(snapshot: VersionSnapshot): VersionSnapshotRecord {
		return {
                  id: snapshot.id,
                  buildPath: snapshot.buildPath,
				  sourceCodePath: snapshot.sourceCodePath,
                  createdAt: snapshot.createdAt
		}
	}

	/** Converts a raw DTO back to a VersionSnapshot */
	static toDomain(record: VersionSnapshotRecord): VersionSnapshot {
		return VersionSnapshot.rehydrate({
                  id: record.id,
                  buildPath: record.buildPath,
				  sourceCodePath: record.sourceCodePath,
                  createdAt: record.createdAt
		})
	}

}