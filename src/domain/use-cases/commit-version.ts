import { FileArtifacts } from "@jigjoy-io/file-artifacts"


export interface CommitVersion {
    execute(projectId: string, fileArtifacts: FileArtifacts): Promise<void>
}