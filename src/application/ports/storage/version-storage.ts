import { VersionSnapshot } from "@domain/project-history/version/version-snapshot"
import { Version } from "@domain/project-history/version/version"

export interface VersionStorage {
	save(version: Version): Promise<VersionSnapshot>
	restore(projectHistoryId: string, snapshot: VersionSnapshot): Promise<Version>
}
