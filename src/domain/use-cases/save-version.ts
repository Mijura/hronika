import { VersionDTO } from "@application/dto/version"

export interface SaveVersion {
    execute(version: VersionDTO): Promise<void>
}