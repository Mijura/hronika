import { Repository } from "@domain/entities/repositiory"

export interface CreateRepository {
    execute(): Promise<string>
}