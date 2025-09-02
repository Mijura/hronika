import { CommitVersionUseCase } from "@application/use-cases/commit-version"
import { PullArtifactsUseCase } from "@application/use-cases/pull-artifacts"
import { RepositoryStore } from "@domain/ports/repository-store"
import { DynamoDBRepositoryStore } from "./adapters/repository-store"
import { CreateRepositoryUseCase } from "@application/use-cases/create-repository"
import { S3ArtifactsStorage } from "./adapters/s3-artifacts-storage"
import { FileStorage, FileStorageProvider } from "@honeycomb-app/file-artifacts"
import { CompressorService } from "@domain/ports/compressor-service"
import { TarGzCompressorService } from "./adapters/targz-compressor-service"
import { FileArtifactsStorage } from "@domain/ports/file-artifacts-storage"

// Repositories
export const repostoryStore: RepositoryStore = new DynamoDBRepositoryStore()

export const fileStorage: FileStorage = FileStorageProvider.create()
export const compressorService: CompressorService = new TarGzCompressorService()

export const artifactsStorage: FileArtifactsStorage = new S3ArtifactsStorage(fileStorage, compressorService)

// UseCases
export const createRepositoryUseCase = new CreateRepositoryUseCase(repostoryStore)
export const commitVersionUseCase = new CommitVersionUseCase(repostoryStore, artifactsStorage)
export const pullArtifactsUseCase = new PullArtifactsUseCase(repostoryStore, artifactsStorage)
