import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { initalizeProjectHistoryUseCase } from "@infrastructure/dependencies"

export async function initailizeProjectHistoryHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		let historyId: string

		try {
			historyId = await initalizeProjectHistoryUseCase.execute()
		} catch (error) {
			throw new Error(`Failed to create repository: ${error}`)
		}

		let response = {
			statusCode: 202,
			body: JSON.stringify({ historyId })
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}