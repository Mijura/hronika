import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { schema } from "@infra/http/schemas/version"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-ai/serverless-core"
import { errorHandler } from "@infra/http/error-handler"
import { Version } from "@domain/project-history/version/version"
import { SaveVersionParams, SaveVersionUseCase } from "@app/ports/use-cases/save-version"
import { VersionDTO } from "@infra/http/dto/version"
import { VersionMapper } from "@infra/http/mappers/version"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createSaveVersionHandler(saveVersionUseCase: SaveVersionUseCase) {

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

			const auth: Auth<UserData> = extractAuthData(event.headers)
			const params: SaveVersionParams = {
				version: version,
			}

			const savedVersion: Version = await saveVersionUseCase.execute(auth, params)
			const savedVersionDTO: VersionDTO = VersionMapper.toDTO(savedVersion)
			return Responses._201(savedVersionDTO)
		} catch (error) {
			return errorHandler(error)
		}
	}
}
