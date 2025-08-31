import { Repository } from "@domain/entities/repositiory"
import { RepositoryStore } from "@domain/ports/repository-store"
import { CreateRepository } from "@domain/use-cases/create-repository"

export class CreateRepositoryUseCase implements CreateRepository{

    constructor(
        private readonly repositoryStore: RepositoryStore
    ) {}

    async execute(): Promise<string> {
        console.log(`Creating repository with id`)
        const repository: Repository = Repository.create()
        try {
            await this.repositoryStore.save(repository)
            console.log(`Repository created with id: ${repository.id}`)
            return repository.id
        } catch (error) {
            throw new Error(`Error creating repository: ${error}`)
        }
    }
}