
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveVersionUseCase } from "@infrastructure/dependencies"
import { VersionDTO, schema } from "@application/dto/version"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infrastructure/http/error-handler"
import { Version } from "@domain/value-objects/version"

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