import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { fetchArtifactsUseCase } from "@infrastructure/dependencies"

export async function fetchArtifactsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {

        const projectHistoryId = event.pathParameters?.projectHistoryId

        if (!projectHistoryId) {
            throw new ValidationError("Missing required path parameter: projectHistoryId")
        }

        try {
            await fetchArtifactsUseCase.execute(projectHistoryId)
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