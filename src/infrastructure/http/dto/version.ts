import { FileArtifacts } from "@domain/project-history/version/file-artifacts"

export const schema = {
	type: "object",
	required: ["projectHistoryId", "buildArtifacts", "sourceCodeArtifacts"],
	properties: {
		projectHistoryId: {
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

export interface VersionDTO {
    projectHistoryId: string
    buildArtifacts: FileArtifacts,
	sourceCodeArtifacts: FileArtifacts
}