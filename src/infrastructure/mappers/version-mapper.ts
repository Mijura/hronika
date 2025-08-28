import { Version } from "@domain/entities/version"
import { VersionRecord } from "@infrastructure/records/version"

export class VersionMapper {

    	/** Converts a Version value object to a raw DTO */
	static toRecord(version: Version): VersionRecord {
		return {
                  id: version.id,
                  projectId: version.projectId,
                  buildArtifactUrl: version.buildArtifactUrl,
                  sourceCodeUrl: version.sourceCodeUrl,
                  createdAt: version.createdAt
		}
	}

	/** Converts a raw DTO back to a Version value object */
	static toDomain(record: VersionRecord): Version {
		return Version.rehydrate({
                  id: record.id,
                  projectId: record.projectId,
                  buildArtifactUrl: record.buildArtifactUrl,
                  sourceCodeUrl: record.sourceCodeUrl,
                  createdAt: record.createdAt
		})
	}

}