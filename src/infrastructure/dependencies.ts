import { ArtifactStorageProvider, FileArtifactsStorage } from "@honeycomb-app/file-artifacts"
import { CommitVersionUseCase } from "@application/use-cases/commit-version"
import { PullArtifactsUseCase } from "@application/use-cases/pull-artifacts"
import { RepositoryStore } from "@domain/ports/repository-store"
import { DynamoDBRepositoryStore } from "./adapters/repository-store"

export const artifactsStorage: FileArtifactsStorage = ArtifactStorageProvider.create()

// Repositories
export const repostoryStore: RepositoryStore = new DynamoDBRepositoryStore()

// UseCases
export const commitVersionUseCase = new CommitVersionUseCase(repostoryStore, artifactsStorage)
export const pullArtifactsUseCase = new PullArtifactsUseCase(repostoryStore, artifactsStorage)
