import { FileArtifacts } from "@honeycomb-app/file-artifacts"


export interface CommitVersion {
    execute(projectId: string, fileArtifacts: FileArtifacts): Promise<void>
}