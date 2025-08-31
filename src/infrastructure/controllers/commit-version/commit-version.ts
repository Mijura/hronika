import Responses from "@infrastructure/http/api-responses"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ValidationError } from "@infrastructure/http/error-handler/errors/validation-error"
import { errorHandler } from "@infrastructure/http/error-handler"
import { schemaValidator } from "@infrastructure/http/schema-validator"
import { commitVersionUseCase } from "@infrastructure/dependencies"
import { CommitVersionDTO, schema } from "@application/dto/commit-version"

export async function commitVersionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const commit: CommitVersionDTO = JSON.parse(body)
        schemaValidator(schema, commit)

		const { projectId, fileArtifacts } = commit

		try {
			await commitVersionUseCase.execute(projectId, fileArtifacts)
		} catch (error) {
			throw new Error(`Failed to commit version: ${error}`)
		}

		let response = {
			statusCode: 202,
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}