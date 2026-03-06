import { v4 as uuidv4 } from "uuid"

export class VersionSnapshot {
	constructor(
		public readonly id: string,
		public readonly buildArchivePath: string,
		public readonly sourceCodeArchivePath: string,
		public readonly createdAt: string = new Date().toISOString(),
	) {}

	static create(buildPath: string, sourceCodePath: string): VersionSnapshot {
		const snapshotId = uuidv4()
		return new VersionSnapshot(snapshotId, buildPath, sourceCodePath)
	}

	static rehydrate(data: {
		id: string
		buildArchivePath: string
		sourceCodeArchivePath: string
		createdAt: string
	}): VersionSnapshot {
		return new VersionSnapshot(data.id, data.buildArchivePath, data.sourceCodeArchivePath, data.createdAt)
	}
}
