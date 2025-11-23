import { APIGatewayProxyResult } from "aws-lambda"
import { Responses } from "@jigjoy-io/serverless-core"
import { initializeProjectHistoryUseCase } from "@infrastructure/dependencies"
import { errorHandler } from "@infrastructure/http/error-handler"

/**
 * Lambda handler for initializing a new project history.
 * 
 * @returns A promise that resolves to an API Gateway proxy result with the new project history ID or an error response
 */
export async function initializeProjectHistoryHandler(): Promise<APIGatewayProxyResult> {

	try {
		let historyId: string = await initializeProjectHistoryUseCase.execute()
		return Responses._201(historyId)
	} catch (error) {
		return errorHandler(error)
	}
}