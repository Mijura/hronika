import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveVersionUseCase } from "@infrastructure/dependencies"
import { VersionDTO, schema } from "@infrastructure/http/dto/version"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infrastructure/http/error-handler"
import { Version } from "@application/value-objects/version"
import { SaveVersion } from "@application/ports/inbound/save-version"

export function createSaveVersionHandler(useCase: SaveVersion) {

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
	
			const versionDTO: VersionDTO = JSON.parse(body)
			schemaValidator(schema, versionDTO)
	
			const { projectHistoryId, buildArtifacts, sourceCodeArtifacts } = versionDTO
			const version = new Version(projectHistoryId, buildArtifacts, sourceCodeArtifacts)
	
			await useCase.execute(version)
	
			return Responses._201()
			
		} catch (error) {
			return errorHandler(error)
		}
	};
  }
  
  // This is what Lambda/SAM uses
  export const handler = createSaveVersionHandler(saveVersionUseCase)