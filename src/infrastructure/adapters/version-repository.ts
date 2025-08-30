import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
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

    get(versionId: string): Promise<Version | null> {
        throw new Error("Method not implemented.")
    }
    
    getAll(projectId: string): Promise<Version[]> {
        throw new Error("Method not implemented.")
    }

}