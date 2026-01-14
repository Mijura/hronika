import { describe, it, expect, beforeEach } from "@rstest/core"
import { GetLatestVersionUseCase } from "@app/use-cases/get-latest-version"
import { InMemoryProjectHistoryRepository } from "@app/test/mocks/in-memory-project-history-repo"
import { InMemoryVersionStorage } from "@app/test/mocks/in-memory-version-storage"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { VersionStorage } from "@app/ports/storage/version-storage"
import { ProjectHistory } from "@domain/project-history/project-history"
import { Version } from "@domain/project-history/version/version"
import { FileArtifacts } from "@domain/project-history/version/file-artifacts"

describe("Get Latest Version", () => {
	let getLatestVersionUseCase: GetLatestVersionUseCase
	let repository: ProjectHistoryRepository
	let versionStorage: VersionStorage

	beforeEach(() => {
		repository = new InMemoryProjectHistoryRepository()
		versionStorage = new InMemoryVersionStorage()
		getLatestVersionUseCase = new GetLatestVersionUseCase(repository, versionStorage)
	})

	it("should successfully retrieve the latest version with artifacts", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const buildArtifacts: FileArtifacts = {
			"dist/index.js": "console.log('build')",
			"dist/style.css": "body { margin: 0; }",
		}
		const sourceCodeArtifacts: FileArtifacts = {
			"src/index.ts": "console.log('source')",
			"src/utils.ts": "export const util = () => {}",
		}
		const version: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts,
			sourceCodeArtifacts,
		}

		// Save version to storage and add snapshot to history
		const snapshot = await versionStorage.save(version)
		projectHistory.addSnapshot(snapshot)
		await repository.save(projectHistory)

		// Act
		const result = await getLatestVersionUseCase.execute(projectHistory.id)

		// Assert
		expect(result).toBeDefined()
		expect(result.projectHistoryId).toBe(projectHistory.id)
		expect(result.buildArtifacts).toEqual(buildArtifacts)
		expect(result.sourceCodeArtifacts).toEqual(sourceCodeArtifacts)
	})

	it("should throw ProjectHistoryNotFound when project history does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"

		// Act & Assert
		await expect(getLatestVersionUseCase.execute(nonExistentId)).rejects.toThrow(
			`Error pulling artifacts: ProjectHistoryNotFoundError: Project history not found: ${nonExistentId}`,
		)
	})

	it("should throw an error when project history is empty", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		await repository.save(projectHistory)

		// Act & Assert
		await expect(getLatestVersionUseCase.execute(projectHistory.id)).rejects.toThrow(
			"Error pulling artifacts: Error: Project history is empty",
		)
	})

	it("should throw an error when version storage restore fails", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const buildArtifacts: FileArtifacts = {
			"dist/index.js": "console.log('build')",
		}
		const sourceCodeArtifacts: FileArtifacts = {
			"src/index.ts": "console.log('source')",
		}
		const version: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts,
			sourceCodeArtifacts,
		}

		// Save version to storage and add snapshot to history
		const snapshot = await versionStorage.save(version)
		projectHistory.addSnapshot(snapshot)
		await repository.save(projectHistory)

		// Create a storage that will fail on restore
		const errorMessage = "Storage restore failed"
		const errorThrowingStorage: VersionStorage = {
			save: async () => {
				throw new Error("Should not be called")
			},
			restore: async () => {
				throw new Error(errorMessage)
			},
		}
		const errorUseCase = new GetLatestVersionUseCase(repository, errorThrowingStorage)

		// Act & Assert
		await expect(errorUseCase.execute(projectHistory.id)).rejects.toThrow(
			`Error pulling artifacts: Error: ${errorMessage}`,
		)
	})

	it("should retrieve the correct latest version when multiple versions exist", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()

		// Save first version
		const version1: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts: { "dist/v1.js": "version 1" },
			sourceCodeArtifacts: { "src/v1.ts": "version 1 source" },
		}
		const snapshot1 = await versionStorage.save(version1)
		projectHistory.addSnapshot(snapshot1)

		// Save second version (latest)
		const version2: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts: { "dist/v2.js": "version 2" },
			sourceCodeArtifacts: { "src/v2.ts": "version 2 source" },
		}
		const snapshot2 = await versionStorage.save(version2)
		projectHistory.addSnapshot(snapshot2)

		await repository.save(projectHistory)

		// Act
		const result = await getLatestVersionUseCase.execute(projectHistory.id)

		// Assert
		expect(result).toBeDefined()
		expect(result.buildArtifacts).toEqual(version2.buildArtifacts)
		expect(result.sourceCodeArtifacts).toEqual(version2.sourceCodeArtifacts)
		expect(result.buildArtifacts).not.toEqual(version1.buildArtifacts)
	})

	it("should throw an error when repository get fails", async () => {
		// Arrange
		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: ProjectHistoryRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error(errorMessage)
			},
		}
		const errorUseCase = new GetLatestVersionUseCase(errorThrowingRepository, versionStorage)

		// Act & Assert
		await expect(errorUseCase.execute("some-id")).rejects.toThrow(`Error pulling artifacts: Error: ${errorMessage}`)
	})
})
