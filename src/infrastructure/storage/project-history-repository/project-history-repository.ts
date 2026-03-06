import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { ProjectHistory } from "@domain/project-history/project-history"
import { ProjectHistoryRepository } from "@app/ports/repositories/project-history-repository"
import { ProjectHistoryMapper } from "@infra/storage/mappers/project-history-mapper"
import { ProjectHistoryRecord } from "@infra/storage/records/project-history"

const client = new DynamoDBClient({
	region: process.env.AWS_REGION,
	profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBProjectHistoryRepository implements ProjectHistoryRepository {
	async save(projectHistory: ProjectHistory): Promise<ProjectHistory> {
		const tableName = process.env.PROJECT_HISTORY_TABLE
		console.log(`Saving project history with id: ${projectHistory.id} to DynamoDB table ${tableName}`)

		const historyRecord: ProjectHistoryRecord = ProjectHistoryMapper.toRecord(projectHistory)

		const params = {
			TableName: tableName,
			Item: historyRecord,
		}

		await ddbDocClient.send(new PutCommand(params))
		return projectHistory
	}

	async get(id: string): Promise<ProjectHistory | null> {
		const tableName = process.env.PROJECT_HISTORY_TABLE
		console.log(`Getting project history with id: ${id} from DynamoDB table ${tableName}`)

		const params = {
			TableName: tableName,
			Key: {
				id: id,
			},
		}

		try {
			const result = await ddbDocClient.send(new GetCommand(params))

			if (!result.Item) {
				console.log(`Project history with id ${id} not found`)
				return null
			}

			const historyRecord: ProjectHistoryRecord = result.Item as ProjectHistoryRecord
			return ProjectHistoryMapper.toDomain(historyRecord)
		} catch (error) {
			console.error(`Error getting project history with id ${id}:`, error)
			throw new Error(`Failed to get project history with id ${id}: ${error}`)
		}
	}
}
