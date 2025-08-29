import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface PullSourceCode {
    execute(versionId: string): Promise<FileArtifacts>
}