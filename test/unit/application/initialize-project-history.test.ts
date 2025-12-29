import { describe, it, expect, beforeEach } from "@rstest/core"
import { InitializeProjectHistoryUseCase } from "@app/use-cases/initialize-project-history"
import { InMemoryProjectHistoryRepository } from "@app/adapters/outbound/in-memory-project-history-repo"
import { ProjectHistoryRepository } from "@app/ports/storage/project-history-repository"
import { ProjectHistory } from "@domain/project-history/project-history"

describe('Initialize Project History', () => {

    let initializeProjectHistoryUseCase: InitializeProjectHistoryUseCase
    let repository: ProjectHistoryRepository

    beforeEach(() => {
        repository = new InMemoryProjectHistoryRepository()
        initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(repository)
    })

    it('should successfully initialize a new project history and return its ID', async () => {
        // Act
        const result = await initializeProjectHistoryUseCase.execute()

        // Assert
        expect(result).toBeDefined()
        expect(typeof result).toBe('string')
        const savedHistory = await repository.get(result)
        expect(savedHistory).not.toBeNull()
        expect(savedHistory!.id).toBe(result)
        expect(savedHistory!.getSnapshots()).toHaveLength(0)
        expect(savedHistory!.getLatestSnapshotId()).toBeNull()
    })

    it('should save the created project history to the repository', async () => {
        // Act
        const id = await initializeProjectHistoryUseCase.execute()

        // Assert
        const savedHistory = await repository.get(id)
        expect(savedHistory).not.toBeNull()
        expect(savedHistory).toBeInstanceOf(ProjectHistory)
    })

    it('should throw an error when repository save fails', async () => {
        // Arrange
        const errorMessage = 'Database connection failed'
        const errorThrowingRepository: ProjectHistoryRepository = {
            save: async () => {
                throw new Error(errorMessage)
            },
            get: async () => null
        }
        const errorUseCase = new InitializeProjectHistoryUseCase(errorThrowingRepository)

        // Act & Assert
        await expect(errorUseCase.execute()).rejects.toThrow('Error initializing project history: Error: Database connection failed')
    })

    it('should create a project history with a unique ID each time', async () => {
        // Act
        const id1 = await initializeProjectHistoryUseCase.execute()
        const id2 = await initializeProjectHistoryUseCase.execute()

        // Assert
        expect(id1).toBeDefined()
        expect(id2).toBeDefined()
        expect(id1).not.toBe(id2)
        const history1 = await repository.get(id1)
        const history2 = await repository.get(id2)
        expect(history1).not.toBeNull()
        expect(history2).not.toBeNull()
        expect(history1!.id).not.toBe(history2!.id)
    })

    it('should create an empty project history with no snapshots', async () => {
        // Act
        const id = await initializeProjectHistoryUseCase.execute()

        // Assert
        const savedHistory = await repository.get(id)
        expect(savedHistory).not.toBeNull()
        expect(savedHistory!.getSnapshots()).toHaveLength(0)
        expect(savedHistory!.getLatestSnapshot()).toBeNull()
        expect(savedHistory!.getLatestSnapshotId()).toBeNull()
    })

})