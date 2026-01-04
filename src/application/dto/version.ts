import { FileArtifactsDTO } from "./file-artifacts"

export type VersionDTO = {
	projectHistoryId: string
	buildArtifacts: FileArtifactsDTO
	sourceCodeArtifacts: FileArtifactsDTO
}
