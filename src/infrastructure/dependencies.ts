
import { InitializeProjectHistoryUseCase } from "@application/use-cases/initialize-project-history"
import { ProjectHistoryRepository } from "@application/ports/outbound/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "@infrastructure/storage/project-history-repository"
import { SaveVersionUseCase } from "@application/use-cases/save-version"
import { GetLatestVersionUseCase } from "@application/use-cases/get-latest-version"
import { VersionStorage } from "@application/ports/outbound/version-storage"
import { S3VersionStorage } from "./storage/s3-version-storage"

// Repositories
export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()

// Artifact Storage
const bucket = process.env.VERSION_CONTROL_BUCKET
if (!bucket) 
    throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

export const versionStorage: VersionStorage = new S3VersionStorage(bucket)

// UseCases
export const initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(projectHistoryRepository)
export const saveVersionUseCase = new SaveVersionUseCase(projectHistoryRepository, versionStorage)
export const getLatestVersionUseCase = new GetLatestVersionUseCase(projectHistoryRepository, versionStorage)
