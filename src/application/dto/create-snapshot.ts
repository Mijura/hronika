import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export const schema = {
	type: "object",
	required: ["repositoryId", "buildArtifacts", "sourceCodeArtifacts"],
	properties: {
		projectId: {
			type: "string",
		},
		buildArtifacts: {
			type: "object",
			additionalProperties: { type: "string" },
			description: "Pre-built source code files"
		},
		sourceCodeArtifacts: {
			type: "object",
			additionalProperties: { type: "string" },
			description: "Source code files"
		},
	},
}

export interface CreateSnapshotDTO {
    historyId: string
    buildArtifacts: FileArtifacts,
	sourceCodeArtifacts: FileArtifacts
}