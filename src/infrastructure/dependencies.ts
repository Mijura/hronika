import { InitializeProjectHistory } from "@app/use-cases/initialize-project-history"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "@infra/storage/project-history-repository"
import { SaveVersion } from "@app/use-cases/save-version"
import { GetLatestVersion } from "@app/use-cases/get-latest-version"
import { VersionStorage } from "@app/ports/storage/version-storage"
import { S3VersionStorage } from "@infra/storage/s3-version-storage"
import { InitializeProjectHistoryUseCase } from "@app/ports/use-cases/initialize-project-history"
import { SaveVersionUseCase } from "@app/ports/use-cases/save-version"
import { GetLatestVersionUseCase } from "@app/ports/use-cases/get-latest-version"

// Repositories
export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()

// Version Storage
const bucket = process.env.VERSION_CONTROL_BUCKET
if (!bucket) throw new Error("Missing VERSION_CONTROL_BUCKET env variable")

export const versionStorage: VersionStorage = new S3VersionStorage(bucket)

// UseCases
export const initializeProjectHistoryUseCase: InitializeProjectHistoryUseCase = new InitializeProjectHistory(
	projectHistoryRepository,
)
export const saveVersionUseCase: SaveVersionUseCase = new SaveVersion(projectHistoryRepository, versionStorage)
export const getLatestVersionUseCase: GetLatestVersionUseCase = new GetLatestVersion(
	projectHistoryRepository,
	versionStorage,
)
