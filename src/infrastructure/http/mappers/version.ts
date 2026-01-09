import { Version } from "@domain/project-history/version/version"
import { VersionDTO } from "@infra/http/dto/version"

export class VersionMapper {
	static toDTO(version: Version): VersionDTO {
		return {
			projectHistoryId: version.projectHistoryId,
			buildArtifacts: version.buildArtifacts,
			sourceCodeArtifacts: version.sourceCodeArtifacts,
		}
	}
}
