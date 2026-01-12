import { VersionSnapshot } from "@domain/project-history/version/version-snapshot"

export class VersionSnapshotMapper {
	/**
	 * Converts a VersionSnapshot domain entity to a storage record.
	 *
	 * @param snapshot - The VersionSnapshot domain entity to convert
	 * @returns A VersionSnapshotRecord suitable for storage
	 */
	static toRecord(snapshot: VersionSnapshot): VersionSnapshotRecord {
		return {
			id: snapshot.id,
			buildArchivePath: snapshot.buildArchivePath,
			sourceCodeArchivePath: snapshot.sourceCodeArchivePath,
			createdAt: snapshot.createdAt,
		}
	}
}
