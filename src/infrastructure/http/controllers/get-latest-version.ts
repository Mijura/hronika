import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { getLatestVersionUseCase } from "@infrastructure/dependencies"
import { VersionDTO } from "@application/dto/version"
import { errorHandler } from "@infrastructure/http/error-handler"

/**
 * Lambda handler for retrieving the latest version of a project.
 * 
 * @param event - The API Gateway proxy event containing the request
 * @returns A promise that resolves to an API Gateway proxy result with the version data or an error response
 */
export async function getLatestVersionHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {

    try {
        const projectHistoryId = event.pathParameters?.projectHistoryId
        if (!projectHistoryId) {
            throw new ValidationError("Missing required path parameter: projectHistoryId")
        }

        const versionDTO: VersionDTO = await getLatestVersionUseCase.execute(projectHistoryId)
        return Responses._200(versionDTO)
    } catch (error) {
        return errorHandler(error)
    }
}