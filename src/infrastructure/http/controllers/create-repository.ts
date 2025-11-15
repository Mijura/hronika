import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { createRepositoryUseCase } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"

export async function createRepositoryHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		let repositoryId: string

		try {
			repositoryId = await createRepositoryUseCase.execute()
		} catch (error) {
			throw new Error(`Failed to create repository: ${error}`)
		}

		let response = {
			statusCode: 202,
			body: JSON.stringify({ repositoryId })
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}