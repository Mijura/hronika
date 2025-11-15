import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export const schema = {
	type: "object",
	required: ["repositoryId", "build", "sourceCode"],
	properties: {
		projectId: {
			type: "string",
		},
		build: {
			type: "object",
			additionalProperties: { type: "string" },
			description: "Pre-built source code files"
		},
		sourceCode: {
			type: "object",
			additionalProperties: { type: "string" },
			description: "Source code files"
		},
	},
}

export interface ArtifactDTO {
    repositoryId: string
    build: FileArtifacts,
	sourceCode: FileArtifacts
}