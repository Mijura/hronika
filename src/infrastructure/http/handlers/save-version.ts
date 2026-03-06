import { SaveVersionUseCase } from "@app/ports/use-cases/save-version"
import { createSaveVersionHandler } from "@infra/http/factories/save-version-handler"
import { SaveVersion } from "@app/use-cases/save-version"
import { projectHistoryRepository } from "@infra/storage/project-history-repository"
import { versionStorage } from "@infra/storage/version-storage"

const saveVersionUseCase: SaveVersionUseCase = new SaveVersion(projectHistoryRepository, versionStorage)

export const handler = createSaveVersionHandler(saveVersionUseCase)
