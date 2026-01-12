import { describe, it, expect } from "@rstest/core"
import { ProjectHistory } from "@domain/project-history/project-history"
import { VersionSnapshot } from "@domain/project-history/version/version-snapshot"

describe("Project History", () => {
	it("should add a snapshot to an empty ProjectHistory", () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const snapshot = VersionSnapshot.create("build/path", "source/path")

		// Act
		const result = projectHistory.addSnapshot(snapshot)

		// Assert
		expect(result).toHaveLength(1)
		expect(result[0]).toBe(snapshot)
		expect(projectHistory.getSnapshots()).toHaveLength(1)
		expect(projectHistory.getLatestSnapshotId()).toBe(snapshot.id)
		expect(projectHistory.getLatestSnapshot()).toBe(snapshot)
	})

	it("should add multiple snapshots and update the latest snapshot", () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const firstSnapshot = VersionSnapshot.create("build/path/1", "source/path/1")
		const secondSnapshot = VersionSnapshot.create("build/path/2", "source/path/2")
		const thirdSnapshot = VersionSnapshot.create("build/path/3", "source/path/3")

		// Act
		projectHistory.addSnapshot(firstSnapshot)
		projectHistory.addSnapshot(secondSnapshot)
		const result = projectHistory.addSnapshot(thirdSnapshot)

		// Assert
		expect(result).toHaveLength(3)
		expect(projectHistory.getSnapshots()).toHaveLength(3)
		expect(projectHistory.getLatestSnapshotId()).toBe(thirdSnapshot.id)
		expect(projectHistory.getLatestSnapshot()).toBe(thirdSnapshot)
	})

	it("should return the updated snapshots array", () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const snapshot1 = VersionSnapshot.create("build/path/1", "source/path/1")
		const snapshot2 = VersionSnapshot.create("build/path/2", "source/path/2")

		// Act
		projectHistory.addSnapshot(snapshot1)
		projectHistory.addSnapshot(snapshot2)

		const snapshots = projectHistory.getSnapshots()

		// Assert
		expect(snapshots).toHaveLength(2)
		expect(snapshots).toContain(snapshot1)
		expect(snapshots).toContain(snapshot2)
	})

	it("should maintain all snapshots in order", () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const snapshot1 = VersionSnapshot.create("build/path/1", "source/path/1")
		const snapshot2 = VersionSnapshot.create("build/path/2", "source/path/2")
		const snapshot3 = VersionSnapshot.create("build/path/3", "source/path/3")

		// Act
		projectHistory.addSnapshot(snapshot1)
		projectHistory.addSnapshot(snapshot2)
		projectHistory.addSnapshot(snapshot3)

		// Assert
		const snapshots = projectHistory.getSnapshots()
		expect(snapshots[0]).toBe(snapshot1)
		expect(snapshots[1]).toBe(snapshot2)
		expect(snapshots[2]).toBe(snapshot3)
	})

	it("should update latestSnapshotId when adding a new snapshot", () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const snapshot1 = VersionSnapshot.create("build/path/1", "source/path/1")
		const snapshot2 = VersionSnapshot.create("build/path/2", "source/path/2")

		// Act & Assert
		projectHistory.addSnapshot(snapshot1)
		expect(projectHistory.getLatestSnapshotId()).toBe(snapshot1.id)

		projectHistory.addSnapshot(snapshot2)
		expect(projectHistory.getLatestSnapshotId()).toBe(snapshot2.id)
		expect(projectHistory.getLatestSnapshotId()).not.toBe(snapshot1.id)
	})

	it("should allow adding snapshots with same paths (different IDs)", () => {
		// Arrange
		const projectHistory = ProjectHistory.create()
		const snapshot1 = VersionSnapshot.create("build/path", "source/path")
		const snapshot2 = VersionSnapshot.create("build/path", "source/path")

		// Act
		projectHistory.addSnapshot(snapshot1)
		projectHistory.addSnapshot(snapshot2)

		// Assert
		expect(projectHistory.getSnapshots()).toHaveLength(2)
		expect(snapshot1.id).not.toBe(snapshot2.id)
		expect(projectHistory.getLatestSnapshotId()).toBe(snapshot2.id)
	})

	describe("create", () => {
		it("should create a new ProjectHistory instance", () => {
			// Act
			const projectHistory = ProjectHistory.create()

			// Assert
			expect(projectHistory).toBeInstanceOf(ProjectHistory)
			expect(projectHistory.id).toBeDefined()
			expect(typeof projectHistory.id).toBe("string")
		})

		it("should create ProjectHistory with a valid UUID v4 id", () => {
			// Act
			const projectHistory = ProjectHistory.create()

			// Assert
			const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(projectHistory.id).toMatch(uuidV4Regex)
		})

		it("should create ProjectHistory with empty initial state", () => {
			// Act
			const projectHistory = ProjectHistory.create()

			// Assert
			expect(projectHistory.getSnapshots()).toHaveLength(0)
			expect(projectHistory.getLatestSnapshotId()).toBeNull()
			expect(projectHistory.getLatestSnapshot()).toBeNull()
		})

		it("should create different ProjectHistory instances with different IDs", () => {
			// Act
			const projectHistory1 = ProjectHistory.create()
			const projectHistory2 = ProjectHistory.create()
			const projectHistory3 = ProjectHistory.create()

			// Assert
			expect(projectHistory1.id).not.toBe(projectHistory2.id)
			expect(projectHistory2.id).not.toBe(projectHistory3.id)
			expect(projectHistory1.id).not.toBe(projectHistory3.id)
		})

		it("should create a ProjectHistory that is ready to use", () => {
			// Arrange
			const projectHistory = ProjectHistory.create()
			const snapshot = VersionSnapshot.create("build/path", "source/path")

			// Act
			projectHistory.addSnapshot(snapshot)

			// Assert
			expect(projectHistory.getSnapshots()).toHaveLength(1)
			expect(projectHistory.getLatestSnapshotId()).toBe(snapshot.id)
			expect(projectHistory.getLatestSnapshot()).toBe(snapshot)
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate ProjectHistory with empty snapshots", () => {
			// Arrange
			const id = "test-id-123"
			const data = {
				id,
				snapshots: [],
				latestSnapshotId: null,
			}

			// Act
			const rehydrated = ProjectHistory.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(id)
			expect(rehydrated.getSnapshots()).toHaveLength(0)
			expect(rehydrated.getLatestSnapshotId()).toBeNull()
			expect(rehydrated.getLatestSnapshot()).toBeNull()
		})

		it("should rehydrate ProjectHistory with a single snapshot", () => {
			// Arrange
			const id = "test-id-456"
			const snapshotData = {
				id: "snapshot-id-1",
				buildArchivePath: "build/path/1",
				sourceCodeArchivePath: "source/path/1",
				createdAt: "2024-01-01T00:00:00.000Z",
			}
			const data = {
				id,
				snapshots: [snapshotData],
				latestSnapshotId: snapshotData.id,
			}

			// Act
			const rehydrated = ProjectHistory.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(id)
			expect(rehydrated.getSnapshots()).toHaveLength(1)
			expect(rehydrated.getLatestSnapshotId()).toBe(snapshotData.id)
			const latestSnapshot = rehydrated.getLatestSnapshot()
			expect(latestSnapshot).not.toBeNull()
			expect(latestSnapshot!.id).toBe(snapshotData.id)
			expect(latestSnapshot!.buildArchivePath).toBe(snapshotData.buildArchivePath)
			expect(latestSnapshot!.sourceCodeArchivePath).toBe(snapshotData.sourceCodeArchivePath)
			expect(latestSnapshot!.createdAt).toBe(snapshotData.createdAt)
		})

		it("should rehydrate ProjectHistory with multiple snapshots", () => {
			// Arrange
			const id = "test-id-789"
			const snapshot1Data = {
				id: "snapshot-id-1",
				buildArchivePath: "build/path/1",
				sourceCodeArchivePath: "source/path/1",
				createdAt: "2024-01-01T00:00:00.000Z",
			}
			const snapshot2Data = {
				id: "snapshot-id-2",
				buildArchivePath: "build/path/2",
				sourceCodeArchivePath: "source/path/2",
				createdAt: "2024-01-02T00:00:00.000Z",
			}
			const snapshot3Data = {
				id: "snapshot-id-3",
				buildArchivePath: "build/path/3",
				sourceCodeArchivePath: "source/path/3",
				createdAt: "2024-01-03T00:00:00.000Z",
			}
			const data = {
				id,
				snapshots: [snapshot1Data, snapshot2Data, snapshot3Data],
				latestSnapshotId: snapshot3Data.id,
			}

			// Act
			const rehydrated = ProjectHistory.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(id)
			expect(rehydrated.getSnapshots()).toHaveLength(3)
			expect(rehydrated.getLatestSnapshotId()).toBe(snapshot3Data.id)
			
			const latestSnapshot = rehydrated.getLatestSnapshot()
			expect(latestSnapshot).not.toBeNull()
			expect(latestSnapshot!.id).toBe(snapshot3Data.id)
			
			const snapshots = rehydrated.getSnapshots()
			expect(snapshots[0].id).toBe(snapshot1Data.id)
			expect(snapshots[1].id).toBe(snapshot2Data.id)
			expect(snapshots[2].id).toBe(snapshot3Data.id)
		})

		it("should rehydrate ProjectHistory with latestSnapshotId pointing to middle snapshot", () => {
			// Arrange
			const id = "test-id-abc"
			const snapshot1Data = {
				id: "snapshot-id-1",
				buildArchivePath: "build/path/1",
				sourceCodeArchivePath: "source/path/1",
				createdAt: "2024-01-01T00:00:00.000Z",
			}
			const snapshot2Data = {
				id: "snapshot-id-2",
				buildArchivePath: "build/path/2",
				sourceCodeArchivePath: "source/path/2",
				createdAt: "2024-01-02T00:00:00.000Z",
			}
			const snapshot3Data = {
				id: "snapshot-id-3",
				buildArchivePath: "build/path/3",
				sourceCodeArchivePath: "source/path/3",
				createdAt: "2024-01-03T00:00:00.000Z",
			}
			const data = {
				id,
				snapshots: [snapshot1Data, snapshot2Data, snapshot3Data],
				latestSnapshotId: snapshot2Data.id,
			}

			// Act
			const rehydrated = ProjectHistory.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(id)
			expect(rehydrated.getSnapshots()).toHaveLength(3)
			expect(rehydrated.getLatestSnapshotId()).toBe(snapshot2Data.id)
			
			const latestSnapshot = rehydrated.getLatestSnapshot()
			expect(latestSnapshot).not.toBeNull()
			expect(latestSnapshot!.id).toBe(snapshot2Data.id)
			expect(latestSnapshot!.buildArchivePath).toBe(snapshot2Data.buildArchivePath)
		})

		it("should return null when latestSnapshotId does not match any snapshot", () => {
			// Arrange
			const id = "test-id-orphan"
			const snapshot1Data = {
				id: "snapshot-id-1",
				buildArchivePath: "build/path/1",
				sourceCodeArchivePath: "source/path/1",
				createdAt: "2024-01-01T00:00:00.000Z",
			}
			const data = {
				id,
				snapshots: [snapshot1Data],
				latestSnapshotId: "non-existent-snapshot-id",
			}

			// Act
			const rehydrated = ProjectHistory.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(id)
			expect(rehydrated.getSnapshots()).toHaveLength(1)
			expect(rehydrated.getLatestSnapshotId()).toBe("non-existent-snapshot-id")
			expect(rehydrated.getLatestSnapshot()).toBeNull()
		})
	})
})
