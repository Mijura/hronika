import { APIGatewayProxyResult } from "aws-lambda"
import { errorHandler, Responses } from "@jigjoy-io/serverless-core"
import { initializeProjectHistoryUseCase } from "@infrastructure/dependencies"

export async function initializeProjectHistoryHandler(): Promise<APIGatewayProxyResult> {
	try {
		let historyId: string

		try {
			historyId = await initializeProjectHistoryUseCase.execute()
		} catch (error) {
			throw new Error(`Failed to initialize project history: ${error}`)
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