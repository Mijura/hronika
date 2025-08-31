import { VersionRecord } from "./version"

export interface RepositoryRecord {
    id: string
    versions: VersionRecord[]
    currentVersionId: string | null
}