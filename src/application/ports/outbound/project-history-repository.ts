import { ProjectHistory } from "@domain/entities/project-history"

export interface ProjectHistoryRepository {
    /**
     * Saves a project history entity to the repository.
     * 
     * @param projectHistory - The project history entity to save
     * @returns A promise that resolves to the saved project history
     */
    save(projectHistory: ProjectHistory): Promise<ProjectHistory>
    
    /**
     * Retrieves a project history by its unique identifier.
     * 
     * @param id - The unique identifier of the project history
     * @returns A promise that resolves to the project history if found, or null if not found
     */
    get(id: string): Promise<ProjectHistory | null>
}