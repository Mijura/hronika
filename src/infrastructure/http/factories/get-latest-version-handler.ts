import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { GetLatestVersionParams, GetLatestVersionUseCase } from "@app/ports/use-cases/get-latest-version"
import { Version } from "@domain/project-history/version/version"
import { VersionMapper } from "../mappers/version"
import { VersionDTO } from "../dto/version"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"
import { Auth } from "@heksagon/app"

export function createGetLatestVersionHandler(getLatestVersionUseCase: GetLatestVersionUseCase) {

	return async function getLatestVersionHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const projectHistoryId = event.pathParameters?.projectHistoryId
			if (!projectHistoryId) {
				throw new ValidationError("Missing required path parameter: projectHistoryId")
			}

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const params: GetLatestVersionParams = {
				projectHistoryId: projectHistoryId,
			}
			
			const version: Version = await getLatestVersionUseCase.execute(auth, params)
			const versionDTO: VersionDTO = VersionMapper.toDTO(version)
			return Responses._200(versionDTO)
		} catch (error) {
			return errorHandler(error)
		}
	}
}
