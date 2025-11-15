import { ProjectHistory } from "@domain/entities/project-history"

export interface ProjectHistoryRepository {
    save(projectHistory: ProjectHistory): Promise<ProjectHistory>
    get(id: string): Promise<ProjectHistory | null>
}