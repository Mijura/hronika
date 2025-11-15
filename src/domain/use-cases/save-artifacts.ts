import { ArtifactsDTO } from "@application/dto/artifacts"

export interface SaveArtifacts {
    execute(artifacts: ArtifactsDTO): Promise<void>
}