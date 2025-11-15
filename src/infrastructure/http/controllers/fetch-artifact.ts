import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { fetchArtifactUseCase } from "@infrastructure/dependencies"

export async function fetchArtifactHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {

        const repositoryId = event.pathParameters?.repositoryId

        if (!repositoryId) {
            throw new ValidationError("Missing required path parameter: repositoryId")
        }

        try {
            await fetchArtifactUseCase.execute(repositoryId)
        } catch (error) {
            throw new Error(`Failed to pull artifacts: ${error}`)
        }

		let response = {
			statusCode: 202,
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}