import { APIGatewayProxyResult } from "aws-lambda"
import { Responses } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { InitializeProjectHistory } from "@app/ports/use-cases/initialize-project-history"

export function createInitializeProjectHistoryHandler(initializeProjectHistoryUseCase: InitializeProjectHistory) {

	/**
	 * Lambda handler for initializing a new project history.
	 * 
	 * @returns A promise that resolves to an API Gateway proxy result with the new project history ID or an error response
	 */
	return async function initializeProjectHistoryHandler(): Promise<APIGatewayProxyResult> {

		try {
			const historyId: string = await initializeProjectHistoryUseCase.execute()
			return Responses._201(historyId)
		} catch (error) {
			return errorHandler(error)
		}
	}
}