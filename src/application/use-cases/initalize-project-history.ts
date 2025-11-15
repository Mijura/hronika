import { ProjectHistory } from "@domain/entities/project-history"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { InitalizeProjectHistory } from "@domain/use-cases/initalize-project-history"

export class InitializeProjectHistoryUseCase implements InitalizeProjectHistory {

    constructor(
        private readonly projectHistoryRepository: ProjectHistoryRepository
    ) {}

    async execute(): Promise<string> {
        console.log(`Creating repository with id`)
        const history: ProjectHistory = ProjectHistory.create()
        try {
            await this.projectHistoryRepository.save(history)
            console.log(`Project history intialized with id: ${history.id}`)
            return history.id
        } catch (error) {
            throw new Error(`Error initalizing project history: ${error}`)
        }
    }
}