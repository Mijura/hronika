import { RepositoryStore } from "@domain/ports/repository-store"
import { DynamoDBRepositoryStore } from "./adapters/repository-store"
import { CreateRepositoryUseCase } from "@application/use-cases/create-repository"
import { S3ArtifactsStorage } from "./adapters/s3-artifacts-storage"
import { FileStorage, FileStorageProvider } from "@jigjoy-io/file-artifacts"
import { CompressorService } from "@domain/ports/compressor-service"
import { TarGzCompressorService } from "./adapters/targz-compressor-service"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"
import { SaveArtifactUseCase } from "@application/use-cases/save-artifact"
import { FetchArtifactUseCase } from "@application/use-cases/fetch-artifact"

// Repositories
export const repostoryStore: RepositoryStore = new DynamoDBRepositoryStore()

export const fileStorage: FileStorage = FileStorageProvider.create()
export const compressorService: CompressorService = new TarGzCompressorService()

export const artifactsStorage: FileArtifactsStorage = new S3ArtifactsStorage(fileStorage, compressorService)

// UseCases
export const createRepositoryUseCase = new CreateRepositoryUseCase(repostoryStore)
export const saveArtifactUseCase = new SaveArtifactUseCase(repostoryStore, artifactsStorage)
export const fetchArtifactUseCase = new FetchArtifactUseCase(repostoryStore, artifactsStorage)
