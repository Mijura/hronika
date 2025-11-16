import { ProjectHistory } from "@domain/entities/project-history"
import { ProjectHistoryRepository } from "@domain/ports/project-history-repository"
import { InitializeProjectHistory } from "@domain/use-cases/initialize-project-history"

export class InitializeProjectHistoryUseCase implements InitializeProjectHistory {

    constructor(
        private readonly historyRepo: ProjectHistoryRepository
    ) {}

    async execute(): Promise<string> {

        console.log(`Project history initialization in progress`)

        const history: ProjectHistory = ProjectHistory.create()

        try {

            await this.historyRepo.save(history)
            console.log(`Project history initialized with id: ${history.id}`)
            return history.id
            
        } catch (error) {
            throw new Error(`Error initializing project history: ${error}`)
        }
    }
}