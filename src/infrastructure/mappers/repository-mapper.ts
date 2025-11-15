import { Repository } from "@domain/entities/project-history"
import { VersionMapper } from "./version-mapper"
import { RepositoryRecord } from "@infrastructure/records/repository"

export class RepositoryMapper {

    static toRecord(repository: Repository): RepositoryRecord {
        return {
            id: repository.id,
            versions: repository.getVersions().map(version => VersionMapper.toRecord(version)),
            currentVersionId: repository.getCurrentVersionId() || null
        }
    }

    static toDomain(record: RepositoryRecord): Repository {
        return  Repository.rehydrate(record)
    }

}