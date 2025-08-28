import { FileArtifacts } from "@domain/value-objects/file-artifacts"

export interface CommitVersion {
    execute(projectId: string, sourceCodeArtifacts: FileArtifacts, buildArtifacts: FileArtifacts): Promise<void>
}