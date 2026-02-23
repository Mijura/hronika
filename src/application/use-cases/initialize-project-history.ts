import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { InitializeProjectHistoryUseCase } from "@app/ports/use-cases/initialize-project-history"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class InitializeProjectHistory implements InitializeProjectHistoryUseCase {
	
	constructor(private readonly historyRepo: ProjectHistoryRepository) {}

	async execute(auth: Auth<UserData>): Promise<string> {
		console.log(`Auth data: ${JSON.stringify(auth)}`)

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
