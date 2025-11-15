import { ArtifactDTO } from "@application/dto/artifact"

export interface FetchArtifact {
    execute(versionId: string): Promise<ArtifactDTO>
}