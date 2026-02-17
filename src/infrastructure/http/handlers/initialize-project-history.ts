import { InitializeProjectHistoryUseCase } from "@app/ports/use-cases/initialize-project-history"
import { InitializeProjectHistory } from "@app/use-cases/initialize-project-history"
import { createInitializeProjectHistoryHandler } from "@infra/http/factories/initialize-project-history-handler"
import { projectHistoryRepository } from "@infra/storage/project-history-repository"

const initializeProjectHistoryUseCase: InitializeProjectHistoryUseCase = new InitializeProjectHistory(
	projectHistoryRepository,
)

export const handler = createInitializeProjectHistoryHandler(initializeProjectHistoryUseCase)
