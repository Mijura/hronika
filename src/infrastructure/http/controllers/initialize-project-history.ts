import { APIGatewayProxyResult } from "aws-lambda"
import { Responses } from "@jigjoy-io/serverless-core"
import { initializeProjectHistoryUseCase } from "@infrastructure/dependencies"
import { errorHandler } from "@infrastructure/http/error-handler"

export async function initializeProjectHistoryHandler(): Promise<APIGatewayProxyResult> {
	try {
		let historyId: string = await initializeProjectHistoryUseCase.execute()

		let response = {
			statusCode: 202,
			body: JSON.stringify({ historyId })
		}

		return Responses._201(response)

	} catch (error) {
		return errorHandler(error)
	}
}