import { Version } from "@domain/value-objects/version"

export interface SaveVersion {
    execute(version: Version): Promise<void>
}