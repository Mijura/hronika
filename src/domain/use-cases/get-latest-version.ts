import { VersionDTO } from "@application/dto/version"

export interface GetLatestVersion {
    execute(projectHistoryId: string): Promise<VersionDTO>
}