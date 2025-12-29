import { VersionDTO } from "@app/dto/version"
import { Version } from "@domain/project-history/version/version"

export class VersionMapper {

    static toDTO(version: Version): VersionDTO {
        return {
            projectHistoryId: version.projectHistoryId,
            buildArtifacts: version.buildArtifacts,
            sourceCodeArtifacts: version.sourceCodeArtifacts
        }
    }
}