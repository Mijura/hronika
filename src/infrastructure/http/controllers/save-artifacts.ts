
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveArtifactsUseCase } from "@infrastructure/dependencies"
import { ArtifactsDTO, schema } from "@application/dto/artifacts"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"

export async function saveArtifactsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const artifacts: ArtifactsDTO = JSON.parse(body)
        schemaValidator(schema, artifacts)

		try {
			await saveArtifactsUseCase.execute(artifacts)
		} catch (error) {
			throw new Error(`Failed to : ${error}`)
		}

		let response = {
			statusCode: 202
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}