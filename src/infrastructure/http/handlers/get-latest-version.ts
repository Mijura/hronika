import { createGetLatestVersionHandler } from "@infra/http/factories/get-latest-version-handler"
import { GetLatestVersion } from "@app/use-cases/get-latest-version"
import { GetLatestVersionUseCase } from "@app/ports/use-cases/get-latest-version"
import { projectHistoryRepository } from "@infra/storage/project-history-repository"
import { versionStorage } from "@infra/storage/version-storage"

export const getLatestVersionUseCase: GetLatestVersionUseCase = new GetLatestVersion(
	projectHistoryRepository,
	versionStorage,
)

export const handler = createGetLatestVersionHandler(getLatestVersionUseCase)
