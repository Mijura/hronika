import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { Version } from "@domain/entities/version"
import { VersionRepository } from "@domain/ports/version-repository"
import { VersionMapper } from "@infrastructure/mappers/version-mapper"
import { VersionRecord } from "@infrastructure/records/version"

const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    profile: process.env.AWS_PROFILE,
})
const ddbDocClient = DynamoDBDocumentClient.from(client)

export class DynamoDBVersionRepository implements VersionRepository {
    
    async save(version: Version): Promise<Version> {
        
        if (!version.id) {
            throw new Error("Version id is required for saving. Missing ID may cause unintended document creation.")
        }

        const tableName = process.env.VERSION_TABLE
        console.log(`Saving version with id: ${version.id} to DynamoDB table ${tableName}`)

        const versionRecord: VersionRecord = VersionMapper.toRecord(version)

        const params = {
            TableName: tableName,
            Item: versionRecord,
        }

        await ddbDocClient.send(new PutCommand(params))
        return version
    }

    async get(versionId: string): Promise<Version> {
        const tableName = process.env.VERSION_TABLE
        console.log(`Getting version with id: ${versionId} from DynamoDB table ${tableName}`)

        const params = {
            TableName: tableName,
            Key: {
                id: versionId
            }
        }

        try {
            const result = await ddbDocClient.send(new GetCommand(params))
            
            if (!result.Item) {
                console.log(`Version with id ${versionId} not found`)
                throw new Error(`Version with id ${versionId} not found`)
            }

            const versionRecord: VersionRecord = result.Item as VersionRecord
            return VersionMapper.toDomain(versionRecord)
        } catch (error) {
            console.error(`Error getting version ${versionId}:`, error)
            throw new Error(`Failed to get version ${versionId}: ${error}`)
        }
    }
    
    async getAll(projectId: string): Promise<Version[]> {
        const tableName = process.env.VERSION_TABLE
        console.log(`Getting all versions for project: ${projectId} from DynamoDB table ${tableName}`)

        const params = {
            TableName: tableName,
            IndexName: "projectGSI",
            KeyConditionExpression: "projectId = :projectId",
            ExpressionAttributeValues: {
                ":projectId": projectId
            }
        }

        try {
            const result = await ddbDocClient.send(new QueryCommand(params))
            
            if (!result.Items || result.Items.length === 0) {
                console.log(`No versions found for project ${projectId}`)
                return []
            }

            const versionRecords: VersionRecord[] = result.Items as VersionRecord[]
            return versionRecords.map(record => VersionMapper.toDomain(record))
        } catch (error) {
            console.error(`Error getting versions for project ${projectId}:`, error)
            throw new Error(`Failed to get versions for project ${projectId}: ${error}`)
        }
    }

}