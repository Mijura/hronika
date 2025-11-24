import { ProjectHistoryRepository } from "@app/ports/outbound/project-history-repository"
import { ProjectHistory } from "@domain/entities/project-history"

export class InMemoryProjectHistoryRepository implements ProjectHistoryRepository {

    private storage: Map<string, ProjectHistory> = new Map()

    async save(projectHistory: ProjectHistory): Promise<ProjectHistory> {
        // Store the project history in memory
        this.storage.set(projectHistory.id, projectHistory)
        return projectHistory
    }

    async get(id: string): Promise<ProjectHistory | null> {
        const projectHistory = this.storage.get(id)
        return projectHistory ?? null
    }
    
}