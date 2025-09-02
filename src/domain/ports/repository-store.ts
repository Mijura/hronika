import { Repository } from "@domain/entities/repositiory"

export interface RepositoryStore {
    save(repository: Repository): Promise<Repository>
    get(id: string): Promise<Repository | null>
}