import { describe, it, expect } from "@rstest/core"
import { ProjectHistory } from '@domain/entities/project-history'
import { VersionSnapshot } from '@domain/entities/version-snapshot'

describe("Project History", () => {

    it('should add a snapshot to an empty ProjectHistory', () => {
        // Arrange
        const projectHistory = ProjectHistory.create()
        const snapshot = VersionSnapshot.create('build/path', 'source/path')

        // Act
        const result = projectHistory.addSnapshot(snapshot)

        // Assert
        expect(result).toHaveLength(1)
        expect(result[0]).toBe(snapshot)
        expect(projectHistory.getSnapshots()).toHaveLength(1)
        expect(projectHistory.getLatestSnapshotId()).toBe(snapshot.id)
        expect(projectHistory.getLatestSnapshot()).toBe(snapshot)
    })

    it('should add multiple snapshots and update the latest snapshot', () => {
        // Arrange
        const projectHistory = ProjectHistory.create()
        const firstSnapshot = VersionSnapshot.create('build/path/1', 'source/path/1')
        const secondSnapshot = VersionSnapshot.create('build/path/2', 'source/path/2')
        const thirdSnapshot = VersionSnapshot.create('build/path/3', 'source/path/3')

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

    it('should return the updated snapshots array', () => {
        // Arrange
        const projectHistory = ProjectHistory.create()
        const snapshot1 = VersionSnapshot.create('build/path/1', 'source/path/1')
        const snapshot2 = VersionSnapshot.create('build/path/2', 'source/path/2')

        // Act
        projectHistory.addSnapshot(snapshot1)
        projectHistory.addSnapshot(snapshot2)

        const snapshots = projectHistory.getSnapshots()

        // Assert
        expect(snapshots).toHaveLength(2)
        expect(snapshots).toContain(snapshot1)
        expect(snapshots).toContain(snapshot2)
    })

    it('should maintain all snapshots in order', () => {
        // Arrange
        const projectHistory = ProjectHistory.create()
        const snapshot1 = VersionSnapshot.create('build/path/1', 'source/path/1')
        const snapshot2 = VersionSnapshot.create('build/path/2', 'source/path/2')
        const snapshot3 = VersionSnapshot.create('build/path/3', 'source/path/3')

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

    it('should update latestSnapshotId when adding a new snapshot', () => {
        // Arrange
        const projectHistory = ProjectHistory.create()
        const snapshot1 = VersionSnapshot.create('build/path/1', 'source/path/1')
        const snapshot2 = VersionSnapshot.create('build/path/2', 'source/path/2')

        // Act & Assert
        projectHistory.addSnapshot(snapshot1)
        expect(projectHistory.getLatestSnapshotId()).toBe(snapshot1.id)

        projectHistory.addSnapshot(snapshot2)
        expect(projectHistory.getLatestSnapshotId()).toBe(snapshot2.id)
        expect(projectHistory.getLatestSnapshotId()).not.toBe(snapshot1.id)
    })

    it('should allow adding snapshots with same paths (different IDs)', () => {
        // Arrange
        const projectHistory = ProjectHistory.create()
        const snapshot1 = VersionSnapshot.create('build/path', 'source/path')
        const snapshot2 = VersionSnapshot.create('build/path', 'source/path')

        // Act
        projectHistory.addSnapshot(snapshot1)
        projectHistory.addSnapshot(snapshot2)

        // Assert
        expect(projectHistory.getSnapshots()).toHaveLength(2)
        expect(snapshot1.id).not.toBe(snapshot2.id)
        expect(projectHistory.getLatestSnapshotId()).toBe(snapshot2.id)
    })

})

