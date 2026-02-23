import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { InitializeProjectHistoryUseCase } from "@app/ports/use-cases/initialize-project-history"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"

export function createInitializeProjectHistoryHandler(initializeProjectHistoryUseCase: InitializeProjectHistoryUseCase) {

	return async function initializeProjectHistoryHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

		const auth: Auth<UserData> = extractAuthData(event)	
		try {
			const historyId: string = await initializeProjectHistoryUseCase.execute(auth)
			return Responses._201(historyId)
		} catch (error) {
			return errorHandler(error)
		}
	}
}
