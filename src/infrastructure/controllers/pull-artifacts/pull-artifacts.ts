import Responses from "@infrastructure/http/api-responses"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ValidationError } from "@infrastructure/http/error-handler/errors/validation-error"
import { errorHandler } from "@infrastructure/http/error-handler"
import { pullArtifactsUseCase } from "@infrastructure/dependencies"

export async function pullArtifactsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {

        const projectId = event.pathParameters?.projectId

        if (!projectId) {
            throw new ValidationError("Missing required path parameter: projectId")
        }

        try {
            await pullArtifactsUseCase.execute(projectId)
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