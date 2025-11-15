import { ProjectSnapshot } from "@domain/value-objects/project-snapshot"

export class ProjectSnapshotMapper {

    /** Converts a Project Snapshot value object to a raw DTO */
	static toRecord(snapshot: ProjectSnapshot): ProjectSnapshotRecord {
		return {
                  id: snapshot.id,
                  buildPath: snapshot.buildPath,
				  sourceCodePath: snapshot.sourceCodePath,
                  createdAt: snapshot.createdAt
		}
	}

	/** Converts a raw DTO back to a ProjectSnapshot value object */
	static toDomain(record: ProjectSnapshotRecord): ProjectSnapshot {
		return ProjectSnapshot.rehydrate({
                  id: record.id,
                  buildPath: record.buildPath,
				  sourceCodePath: record.sourceCodePath,
                  createdAt: record.createdAt
		})
	}

}