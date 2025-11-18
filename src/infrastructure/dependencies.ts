import { S3ArtifactsStorage } from "./adapters/s3-artifacts-storage"
import { FileStorage, FileStorageProvider } from "@jigjoy-io/file-storage"
import { CompressorService } from "@domain/ports/compressor-service"
import { TarGzCompressorService } from "./adapters/targz-compressor-service"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { InitializeProjectHistoryUseCase } from "@application/use-cases/initialize-project-history"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "./adapters/project-history-repository"
import { SaveVersionUseCase } from "@application/use-cases/save-version"
import { GetLatestVersionUseCase } from "@application/use-cases/get-latest-version"

// Repositories
export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()

// Artifact Storage
export const fileStorage: FileStorage = FileStorageProvider.create()
export const compressorService: CompressorService = new TarGzCompressorService()
export const artifactsStorage: FileArtifactsStorage = new S3ArtifactsStorage(fileStorage, compressorService)

// UseCases
export const initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(projectHistoryRepository)
export const saveVersionUseCase = new SaveVersionUseCase(projectHistoryRepository, artifactsStorage)
export const getLatestVersionUseCase = new GetLatestVersionUseCase(projectHistoryRepository, artifactsStorage)
