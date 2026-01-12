import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBProjectHistoryRepository } from "@infra/storage/project-history-repository"
import { ProjectHistory } from "@domain/project-history/project-history"
import { VersionSnapshot } from "@domain/project-history/version/version-snapshot"

describe("DynamoDB Project History Repository", () => {
	let repository: DynamoDBProjectHistoryRepository
	let ddbDocClient: DynamoDBDocumentClient
	const testProjectHistoryIds: string[] = []

	const client = new DynamoDBClient({
		region: process.env.AWS_REGION,
		profile: process.env.AWS_PROFILE,
	})

	beforeEach(() => {
		ddbDocClient = DynamoDBDocumentClient.from(client)
		repository = new DynamoDBProjectHistoryRepository()
	})

	afterEach(async () => {
		// Clean up test data from DynamoDB
		const tableName = process.env.PROJECT_HISTORY_TABLE
		if (!tableName) return

		for (const id of testProjectHistoryIds) {
			try {
				await ddbDocClient.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							id: id,
						},
					}),
				)
			} catch (error) {
				console.error(`Failed to delete test data with id ${id}:`, error)
			}
		}
		testProjectHistoryIds.length = 0
	})

	it("should save a project history to DynamoDB", async () => {
		const projectHistory = ProjectHistory.create()
		testProjectHistoryIds.push(projectHistory.id)

		const saved = await repository.save(projectHistory)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(projectHistory.id)
		expect(saved.getSnapshots()).toHaveLength(0)
		expect(saved.getLatestSnapshotId()).toBeNull()
	})

	it("should save a project history with snapshots to DynamoDB", async () => {
		const projectHistory = ProjectHistory.create()
		const snapshot1 = VersionSnapshot.create("s3://bucket/build-1.zip", "s3://bucket/source-1.zip")
		const snapshot2 = VersionSnapshot.create("s3://bucket/build-2.zip", "s3://bucket/source-2.zip")

		projectHistory.addSnapshot(snapshot1)
		projectHistory.addSnapshot(snapshot2)
		testProjectHistoryIds.push(projectHistory.id)

		const saved = await repository.save(projectHistory)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(projectHistory.id)
		expect(saved.getSnapshots()).toHaveLength(2)
		expect(saved.getLatestSnapshotId()).toEqual(snapshot2.id)
	})

	it("should retrieve a previously saved project history from DynamoDB", async () => {
		const projectHistory = ProjectHistory.create()
		const snapshot = VersionSnapshot.create("s3://bucket/build.zip", "s3://bucket/source.zip")
		projectHistory.addSnapshot(snapshot)
		testProjectHistoryIds.push(projectHistory.id)

		await repository.save(projectHistory)
		const retrieved = await repository.get(projectHistory.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.id).toEqual(projectHistory.id)
		expect(retrieved?.getSnapshots()).toHaveLength(1)
		expect(retrieved?.getLatestSnapshotId()).toEqual(snapshot.id)

		const retrievedSnapshot = retrieved?.getLatestSnapshot()
		expect(retrievedSnapshot).toBeDefined()
		expect(retrievedSnapshot?.id).toEqual(snapshot.id)
		expect(retrievedSnapshot?.buildArchivePath).toEqual(snapshot.buildArchivePath)
		expect(retrievedSnapshot?.sourceCodeArchivePath).toEqual(snapshot.sourceCodeArchivePath)
	})

	it("should return null when retrieving a non-existent project history", async () => {
		const nonExistentId = "non-existent-id"

		const retrieved = await repository.get(nonExistentId)

		expect(retrieved).toBeNull()
	})

	it("should save and retrieve a project history with multiple snapshots correctly", async () => {
		const projectHistory = ProjectHistory.create()
		const snapshot1 = VersionSnapshot.create("s3://bucket/build-1.zip", "s3://bucket/source-1.zip")
		const snapshot2 = VersionSnapshot.create("s3://bucket/build-2.zip", "s3://bucket/source-2.zip")
		const snapshot3 = VersionSnapshot.create("s3://bucket/build-3.zip", "s3://bucket/source-3.zip")

		projectHistory.addSnapshot(snapshot1)
		projectHistory.addSnapshot(snapshot2)
		projectHistory.addSnapshot(snapshot3)
		testProjectHistoryIds.push(projectHistory.id)

		await repository.save(projectHistory)
		const retrieved = await repository.get(projectHistory.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.getSnapshots()).toHaveLength(3)
		expect(retrieved?.getLatestSnapshotId()).toEqual(snapshot3.id)

		const snapshots = retrieved?.getSnapshots() || []
		expect(snapshots[0].id).toEqual(snapshot1.id)
		expect(snapshots[1].id).toEqual(snapshot2.id)
		expect(snapshots[2].id).toEqual(snapshot3.id)
	})

	it("should throw an error when DynamoDB get operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_HISTORY_TABLE
		process.env.PROJECT_HISTORY_TABLE = ""

		try {
			await expect(repository.get("some-id")).rejects.toThrow("Failed to get project history")
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_HISTORY_TABLE = originalTableName
			} else {
				delete process.env.PROJECT_HISTORY_TABLE
			}
		}
	})
})
