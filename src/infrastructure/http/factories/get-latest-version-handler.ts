import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { GetLatestVersion } from "@app/ports/use-cases/get-latest-version"
import { Version } from "@domain/project-history/version/version"
import { VersionMapper } from "../mappers/version"
import { VersionDTO } from "../dto/version"

export function createGetLatestVersionHandler(getLatestVersionUseCase: GetLatestVersion) {
	/**
	 * Lambda handler for retrieving the latest version of a project.
	 *
	 * @param event - The API Gateway proxy event containing the request
	 * @returns A promise that resolves to an API Gateway proxy result with the version data or an error response
	 */
	return async function getLatestVersionHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const projectHistoryId = event.pathParameters?.projectHistoryId
			if (!projectHistoryId) {
				throw new ValidationError("Missing required path parameter: projectHistoryId")
			}

			const version: Version = await getLatestVersionUseCase.execute(projectHistoryId)
			const versionDTO: VersionDTO = VersionMapper.toDTO(version)
			return Responses._200(versionDTO)
		} catch (error) {
			return errorHandler(error)
		}
	}
}
