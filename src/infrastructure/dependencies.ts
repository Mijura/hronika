
import { InitializeProjectHistoryUseCase } from "@app/use-cases/initialize-project-history"
import { ProjectHistoryRepository } from "@app/ports/outbound/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "@infra/storage/project-history-repository"
import { SaveVersionUseCase } from "@app/use-cases/save-version"
import { GetLatestVersionUseCase } from "@app/use-cases/get-latest-version"
import { VersionStorage } from "@app/ports/outbound/version-storage"
import { S3VersionStorage } from "@infra/storage/s3-version-storage"

// Repositories
export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()

// Version Storage
const bucket = process.env.VERSION_CONTROL_BUCKET
if (!bucket) 
    throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

export const versionStorage: VersionStorage = new S3VersionStorage(bucket)

// UseCases
export const initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(projectHistoryRepository)
export const saveVersionUseCase = new SaveVersionUseCase(projectHistoryRepository, versionStorage)
export const getLatestVersionUseCase = new GetLatestVersionUseCase(projectHistoryRepository, versionStorage)
