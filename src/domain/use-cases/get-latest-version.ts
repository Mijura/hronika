import { Version } from "@domain/value-objects/version"

export interface GetLatestVersion {
    execute(projectHistoryId: string): Promise<Version>
}