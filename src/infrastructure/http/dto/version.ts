import { FileArtifacts } from "@domain/project-history/version/file-artifacts"

export type VersionDTO = {
	projectHistoryId: string
	buildArtifacts: FileArtifacts
	sourceCodeArtifacts: FileArtifacts
}
