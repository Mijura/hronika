import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { InitializeProjectHistory } from "@app/ports/use-cases/initialize-project-history"

export class InitializeProjectHistoryUseCase implements InitializeProjectHistory {

    constructor(
        private readonly historyRepo: ProjectHistoryRepository
    ) {}

    /**
     * Initializes a new project history and saves it to the repository.
     * 
     * @returns A promise that resolves to the unique identifier of the newly created project history
     * @throws {Error} If there's an error during the initialization process
     */
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