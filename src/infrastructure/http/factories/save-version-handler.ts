import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { schema } from "@infra/http/schemas/version"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { Version } from "@domain/project-history/version/version"
import { SaveVersion } from "@app/ports/use-cases/save-version"
import { VersionDTO } from "@infra/http/dto/version"
import { VersionMapper } from "@infra/http/mappers/version"

export function createSaveVersionHandler(saveVersionUseCase: SaveVersion) {
	/**
	 * Lambda handler for saving a new version snapshot to a project history.
	 *
	 * @param event - The API Gateway proxy event containing the request body with version data
	 * @returns A promise that resolves to an API Gateway proxy result indicating success or an error response
	 */
	return async function saveVersionHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const { body } = event
			if (!body) {
				throw new ValidationError("No page body")
			}

			const parsedBody = JSON.parse(body)
			schemaValidator(schema, parsedBody)

			const versionDTO: VersionDTO = parsedBody as VersionDTO
			const version: Version = {
				projectHistoryId: versionDTO.projectHistoryId,
				buildArtifacts: versionDTO.buildArtifacts,
				sourceCodeArtifacts: versionDTO.sourceCodeArtifacts,
			}

			const savedVersion: Version = await saveVersionUseCase.execute(version)
			const savedVersionDTO: VersionDTO = VersionMapper.toDTO(savedVersion)
			return Responses._201(savedVersionDTO)
		} catch (error) {
			return errorHandler(error)
		}
	}
}
