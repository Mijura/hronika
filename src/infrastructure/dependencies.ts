import { S3Storage } from "@infrastructure/adapters/s3-artifacts-storage"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { InitializeProjectHistoryUseCase } from "@application/use-cases/initialize-project-history"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "@infrastructure/adapters/project-history-repository"
import { SaveVersionUseCase } from "@application/use-cases/save-version"
import { GetLatestVersionUseCase } from "@application/use-cases/get-latest-version"

// Repositories
export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()

// Artifact Storage
const bucket = process.env.VERSION_CONTROL_BUCKET
if (!bucket) 
    throw new Error('Missing VERSION_CONTROL_BUCKET env variable')

export const artifactsStorage: FileArtifactsStorage = new S3Storage(bucket)

// UseCases
export const initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(projectHistoryRepository)
export const saveVersionUseCase = new SaveVersionUseCase(projectHistoryRepository, artifactsStorage)
export const getLatestVersionUseCase = new GetLatestVersionUseCase(projectHistoryRepository, artifactsStorage)
