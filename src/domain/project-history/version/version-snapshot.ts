import { v4 as uuidv4 } from "uuid"

export class VersionSnapshot {
	constructor(
		public readonly id: string,
		public readonly buildArchivePath: string,
		public readonly sourceCodeArchivePath: string,
		public readonly createdAt: string = new Date().toISOString(),
	) {}

	/**
	 * Creates a new version snapshot with a generated unique identifier.
	 *
	 * @param buildPath - The path to the build artifacts archive
	 * @param sourceCodePath - The path to the source code artifacts archive
	 * @returns A new VersionSnapshot instance
	 */
	static create(buildPath: string, sourceCodePath: string): VersionSnapshot {
		const snapshotId = uuidv4()
		return new VersionSnapshot(snapshotId, buildPath, sourceCodePath)
	}

	/**
	 * Rehydrates a version snapshot entity from persisted data.
	 *
	 * @param data - The persisted data containing id, buildArchivePath, sourceCodeArchivePath, and createdAt
	 * @returns A rehydrated VersionSnapshot instance
	 */
	static rehydrate(data: {
		id: string
		buildArchivePath: string
		sourceCodeArchivePath: string
		createdAt: string
	}): VersionSnapshot {
		return new VersionSnapshot(data.id, data.buildArchivePath, data.sourceCodeArchivePath, data.createdAt)
	}
}
