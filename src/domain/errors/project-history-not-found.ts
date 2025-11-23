export class ProjectHistoryNotFound extends Error {
    
    constructor(projectHistoryId: string) {
        super(`Project history not found: ${projectHistoryId}`)
        this.name = 'ProjectHistoryNotFoundError'
    }
}