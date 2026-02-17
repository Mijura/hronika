import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { DynamoDBProjectHistoryRepository } from "@infra/storage/project-history-repository/project-history-repository"

export const projectHistoryRepository: ProjectHistoryRepository = new DynamoDBProjectHistoryRepository()
