export class ProjectHistoryNotFoundError extends Error {
    
    constructor(projectHistoryId: string) {
        super(`ProjectHistory not found: ${projectHistoryId}`)
        this.name = 'ProjectHistoryNotFoundError'
    }
}