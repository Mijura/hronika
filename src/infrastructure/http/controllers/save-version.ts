
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveVersionUseCase } from "@infrastructure/dependencies"
import { VersionDTO, schema } from "@infrastructure/http/dto/version"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infrastructure/http/error-handler"
import { Version } from "@domain/value-objects/version"

/**
 * Lambda handler for saving a new version snapshot to a project history.
 * 
 * @param event - The API Gateway proxy event containing the request body with version data
 * @returns A promise that resolves to an API Gateway proxy result indicating success or an error response
 */
export async function saveVersionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	
	try {
		if (!body) throw new ValidationError("No page body")

		const versionDTO: VersionDTO = JSON.parse(body)
        schemaValidator(schema, versionDTO)

		const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = versionDTO
		const version = new Version(projectHistoryId, buildArtifacts, sourceCodeArtifacts)

		await saveVersionUseCase.execute(version)

		return Responses._201()
	} catch (error) {
		return errorHandler(error)
	}
}