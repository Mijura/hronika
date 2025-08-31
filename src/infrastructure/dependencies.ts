import { ArtifactStorageProvider, FileArtifactsStorage } from "@honeycomb-app/file-artifacts"
import { VersionRepository } from "@domain/ports/version-repository"
import { CommitVersionUseCase } from "@application/use-cases/commit-version"
import { DynamoDBVersionRepository } from "./adapters/version-repository"
import { PullArtifactsUseCase } from "@application/use-cases/pull-artifacts"

export const artifactsStorage: FileArtifactsStorage = ArtifactStorageProvider.create()

// Repositories
export const versionRepository: VersionRepository = new DynamoDBVersionRepository()

// UseCases
export const commitVersionUseCase = new CommitVersionUseCase(versionRepository, artifactsStorage)
export const pullArtifactsUseCase = new PullArtifactsUseCase(versionRepository, artifactsStorage)
