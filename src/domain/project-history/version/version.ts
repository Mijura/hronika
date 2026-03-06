import { FileArtifacts } from "@domain/project-history/version/file-artifacts"

export type Version = {
	projectHistoryId: string
	buildArtifacts: FileArtifacts
	sourceCodeArtifacts: FileArtifacts
}
