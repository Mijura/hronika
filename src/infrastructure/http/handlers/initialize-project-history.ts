import { createInitializeProjectHistoryHandler } from "@infra/http/factories/create-initialize-project-history-handler"
import { initializeProjectHistoryUseCase } from "@infra/dependencies"

export const handler = createInitializeProjectHistoryHandler(initializeProjectHistoryUseCase)