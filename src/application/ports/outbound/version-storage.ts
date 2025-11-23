import { VersionSnapshot } from "@domain/entities/version-snapshot"
import { Version } from "@application/value-objects/version"

export interface VersionStorage {
    save(version: Version): Promise<VersionSnapshot>
    restore(projectHistoryId: string, snapshot: VersionSnapshot): Promise<Version>
}