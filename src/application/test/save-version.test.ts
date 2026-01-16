import { describe, it, expect, beforeEach } from "@rstest/core"
import { SaveVersion } from "@app/use-cases/save-version"
import { InMemoryProjectHistoryRepository } from "@app/test/mocks/in-memory-project-history-repo"
import { InMemoryVersionStorage } from "@app/test/mocks/in-memory-version-storage"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { VersionStorage } from "@app/ports/storage/version-storage"
import { ProjectHistory } from "@domain/project-history/project-history"
import { Version } from "@domain/project-history/version/version"
import { FileArtifacts } from "@domain/project-history/version/file-artifacts"

describe("Save Version", () => {
	let saveVersionUseCase: SaveVersion
	let repository: ProjectHistoryRepository
	let versionStorage: VersionStorage

	beforeEach(() => {
		repository = new InMemoryProjectHistoryRepository()
		versionStorage = new InMemoryVersionStorage()
		saveVersionUseCase = new SaveVersion(repository, versionStorage)
	})

	it("should successfully save a version and add snapshot to project history", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		await repository.save(projectHistory)

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

		// Act
		const result = await saveVersionUseCase.execute(version)

		// Assert
		expect(result).toBeDefined()
		expect(result).toEqual(version)

		// Verify snapshot was added to project history
		const savedHistory = await repository.get(projectHistory.id)
		expect(savedHistory).not.toBeNull()
		expect(savedHistory!.getSnapshots()).toHaveLength(1)
		expect(savedHistory!.getLatestSnapshot()).not.toBeNull()
		expect(savedHistory!.getLatestSnapshotId()).not.toBeNull()
	})

	it("should throw ProjectHistoryNotFound when project history does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"
		const version: Version = {
			projectHistoryId: nonExistentId,
			buildArtifacts: {},
			sourceCodeArtifacts: {},
		}

		// Act & Assert
		await expect(saveVersionUseCase.execute(version)).rejects.toThrow(
			`Error during saving artifacts version: ProjectHistoryNotFoundError: Project history not found: ${nonExistentId}`,
		)
	})

	it("should throw an error when version storage save fails", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		await repository.save(projectHistory)

		const version: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts: { "dist/index.js": "build" },
			sourceCodeArtifacts: { "src/index.ts": "source" },
		}

		const errorMessage = "Storage save failed"
		const errorThrowingStorage: VersionStorage = {
			save: async () => {
				throw new Error(errorMessage)
			},
			restore: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new SaveVersion(repository, errorThrowingStorage)

		// Act & Assert
		await expect(errorUseCase.execute(version)).rejects.toThrow(
			`Error during saving artifacts version: Error: ${errorMessage}`,
		)
	})

	it("should throw an error when repository save fails", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		await repository.save(projectHistory)

		const version: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts: { "dist/index.js": "build" },
			sourceCodeArtifacts: { "src/index.ts": "source" },
		}

		const errorMessage = "Repository save failed"
		const errorThrowingRepository: ProjectHistoryRepository = {
			save: async () => {
				throw new Error(errorMessage)
			},
			get: async (id: string) => {
				// Return the project history for the initial get call
				if (id === projectHistory.id) {
					return projectHistory
				}
				return null
			},
		}
		const errorUseCase = new SaveVersion(errorThrowingRepository, versionStorage)

		// Act & Assert
		await expect(errorUseCase.execute(version)).rejects.toThrow(
			`Error during saving artifacts version: Error: ${errorMessage}`,
		)
	})

	it("should successfully save multiple versions to the same project history", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		await repository.save(projectHistory)

		const version1: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts: { "dist/v1.js": "version 1" },
			sourceCodeArtifacts: { "src/v1.ts": "version 1 source" },
		}

		const version2: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts: { "dist/v2.js": "version 2" },
			sourceCodeArtifacts: { "src/v2.ts": "version 2 source" },
		}

		// Act
		await saveVersionUseCase.execute(version1)
		await saveVersionUseCase.execute(version2)

		// Assert
		const savedHistory = await repository.get(projectHistory.id)
		expect(savedHistory).not.toBeNull()
		expect(savedHistory!.getSnapshots()).toHaveLength(2)
		expect(savedHistory!.getLatestSnapshot()).not.toBeNull()
		expect(savedHistory!.getLatestSnapshotId()).toBe(savedHistory!.getSnapshots()[1].id)
	})

	it("should preserve artifact content when saving version", async () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		await repository.save(projectHistory)

		const buildArtifacts: FileArtifacts = {
			"dist/index.js": "console.log('build')",
			"dist/style.css": "body { margin: 0; }",
		}
		const sourceCodeArtifacts: FileArtifacts = {
			"src/index.ts": "console.log('source')",
		}
		const version: Version = {
			projectHistoryId: projectHistory.id,
			buildArtifacts,
			sourceCodeArtifacts,
		}

		// Act
		const result = await saveVersionUseCase.execute(version)

		// Assert
		expect(result.buildArtifacts).toEqual(buildArtifacts)
		expect(result.sourceCodeArtifacts).toEqual(sourceCodeArtifacts)
		expect(Object.keys(result.buildArtifacts)).toHaveLength(2)
		expect(Object.keys(result.sourceCodeArtifacts)).toHaveLength(1)
	})

	it("should throw an error when repository get fails", async () => {
		// Arrange
		const version: Version = {
			projectHistoryId: "some-id",
			buildArtifacts: {},
			sourceCodeArtifacts: {},
		}

		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: ProjectHistoryRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error(errorMessage)
			},
		}
		const errorUseCase = new SaveVersion(errorThrowingRepository, versionStorage)

		// Act & Assert
		await expect(errorUseCase.execute(version)).rejects.toThrow(
			`Error during saving artifacts version: Error: ${errorMessage}`,
		)
	})
})
