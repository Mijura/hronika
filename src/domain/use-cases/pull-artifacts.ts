import { FileArtifacts } from "@jigjoy-io/file-artifacts"


export interface PullArtifacts {
    execute(versionId: string): Promise<FileArtifacts>
}