
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveArtifactUseCase } from "@infrastructure/dependencies"
import { ArtifactDTO, schema } from "@application/dto/artifact"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"

export async function commitVersionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const artifact: ArtifactDTO = JSON.parse(body)
        schemaValidator(schema, artifact)

		try {
			await saveArtifactUseCase.execute(artifact)
		} catch (error) {
			throw new Error(`Failed to commit version: ${error}`)
		}

		let response = {
			statusCode: 202
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}