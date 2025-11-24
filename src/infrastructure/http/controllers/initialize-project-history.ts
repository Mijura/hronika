import { APIGatewayProxyResult } from "aws-lambda"
import { Responses } from "@jigjoy-io/serverless-core"
import { initializeProjectHistoryUseCase } from "@infra/dependencies"
import { errorHandler } from "@infra/http/error-handler"
import { InitializeProjectHistory } from "@app/ports/inbound/initialize-project-history"

export function createInitializeProjectHistoryHandler(useCase: InitializeProjectHistory) {

	/**
	 * Lambda handler for initializing a new project history.
	 * 
	 * @returns A promise that resolves to an API Gateway proxy result with the new project history ID or an error response
	 */
	return async function initializeProjectHistoryHandler(): Promise<APIGatewayProxyResult> {

		try {
			const historyId: string = await useCase.execute()
			return Responses._201(historyId)
		} catch (error) {
			return errorHandler(error)
		}
	}
}

// This is the handler used by AWS Lambda:
export const handler = createInitializeProjectHistoryHandler(initializeProjectHistoryUseCase)