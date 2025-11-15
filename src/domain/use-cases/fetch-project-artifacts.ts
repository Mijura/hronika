import { ArtifactsDTO } from "@application/dto/artifacts"

export interface FetchProjectArtifacts {
    execute(projectHistoryId: string): Promise<ArtifactsDTO>
}