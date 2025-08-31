import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb"
import { Repository } from "@domain/entities/repositiory"
import { RepositoryStore } from "@domain/ports/repository-store"
import { RepositoryMapper } from "@infrastructure/mappers/repository-mapper"
import { RepositoryRecord } from "@infrastructure/records/repository"

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBRepositoryStore implements RepositoryStore {

    async save(repository: Repository): Promise<Repository> {
        const tableName = process.env.REPOSITORY_TABLE
        console.log(`Saving repository with id: ${repository.id} to DynamoDB table ${tableName}`)

        const repositoryRecord: RepositoryRecord = RepositoryMapper.toRecord(repository)

        const params = {
            TableName: tableName,
            Item: repositoryRecord,
        }

        await ddbDocClient.send(new PutCommand(params))
        return repository
    }

    async get(id: string): Promise<Repository> {
        const tableName = process.env.REPOSITORY_TABLE
        console.log(`Getting repository with id: ${id} from DynamoDB table ${tableName}`)

        const params = {
            TableName: tableName,
            Key: {
                id: id
            }
        }

        try {
            const result = await ddbDocClient.send(new GetCommand(params))
            
            if (!result.Item) {
                console.log(`Repository with id ${id} not found`)
                throw new Error(`Version with id ${id} not found`)
            }

            const repositoryRecord: RepositoryRecord = result.Item as RepositoryRecord
            return RepositoryMapper.toDomain(repositoryRecord)
        } catch (error) {
            console.error(`Error getting repository with id ${id}:`, error)
            throw new Error(`Failed to get repository with id ${id}: ${error}`)
        }
    }

}