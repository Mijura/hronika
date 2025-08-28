import { CommitVersion } from "@domain/use-cases/commit-version"
import { FileArtifacts } from "@domain/value-objects/file-artifacts"


export class CommitVersionUseCase implements CommitVersion{

    execute(projectId: string, sourceCodeArtifacts: FileArtifacts, buildArtifacts: FileArtifacts): Promise<void> {
        throw new Error("Method not implemented.")
    }

}