import { ArtifactDTO } from "@application/dto/artifact"

export interface SaveArtifact {
    execute(artifact: ArtifactDTO): Promise<void>
}