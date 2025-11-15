import { S3ArtifactsStorage } from "./adapters/s3-artifacts-storage"
import { FileStorage, FileStorageProvider } from "@jigjoy-io/file-artifacts"
import { CompressorService } from "@domain/ports/compressor-service"
import { TarGzCompressorService } from "./adapters/targz-compressor-service"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { SaveArtifactsUseCase } from "@application/use-cases/save-artifacts"
import { InitializeProjectHistoryUseCase } from "@application/use-cases/initialize-project-history"
import { FetchProjectArtifactsUseCase } from "@application/use-cases/fetch-project-artifacts"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "./adapters/project-history-repository"

// Repositories
export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()

// Artifact Storage
export const fileStorage: FileStorage = FileStorageProvider.create()
export const compressorService: CompressorService = new TarGzCompressorService()
export const artifactsStorage: FileArtifactsStorage = new S3ArtifactsStorage(fileStorage, compressorService)

// UseCases
export const initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(projectHistoryRepository)
export const saveArtifactsUseCase = new SaveArtifactsUseCase(projectHistoryRepository, artifactsStorage)
export const fetchArtifactsUseCase = new FetchProjectArtifactsUseCase(projectHistoryRepository, artifactsStorage)
