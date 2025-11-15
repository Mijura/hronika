import { ProjectHistory } from "@domain/entities/project-history"

export interface ProjectHistoryRepository {
    save(repository: ProjectHistory): Promise<ProjectHistory>
    get(id: string): Promise<ProjectHistory | null>
}