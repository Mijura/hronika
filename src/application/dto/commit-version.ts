import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export const schema = {
	type: "object",
	required: ["projectId", "fileArtifacts"],
	properties: {
		projectId: {
			type: "string",
		},
		fileArtifacts: {
			type: "object",
			additionalProperties: { type: "string" },
			description: "Object where keys are file paths and values are file contents"
		},
	},
}

export interface CommitVersionDTO {
    projectId: string
    fileArtifacts: FileArtifacts
}