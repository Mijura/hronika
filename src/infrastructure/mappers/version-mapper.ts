import { Version } from "@domain/entities/version"
import { VersionRecord } from "@infrastructure/records/version"

export class VersionMapper {

    	/** Converts a Version value object to a raw DTO */
	static toRecord(version: Version): VersionRecord {
		return {
                  id: version.id,
                  artifactPath: version.artifactPath,
                  createdAt: version.createdAt
		}
	}

	/** Converts a raw DTO back to a Version value object */
	static toDomain(record: VersionRecord): Version {
		return Version.rehydrate({
                  id: record.id,
                  artifactPath: record.artifactPath,
                  createdAt: record.createdAt
		})
	}

}