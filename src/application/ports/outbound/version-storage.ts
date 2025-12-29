import { VersionSnapshot } from "@domain/project-history/version-snapshot"
import { Version } from "@app/value-objects/version"

export interface VersionStorage {
    save(version: Version): Promise<VersionSnapshot>
    restore(projectHistoryId: string, snapshot: VersionSnapshot): Promise<Version>
}