import { FileArtifacts } from "@honeycomb-app/file-artifacts"


export interface PullArtifacts {
    execute(versionId: string): Promise<FileArtifacts>
}