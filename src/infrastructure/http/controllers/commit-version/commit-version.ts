
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { commitVersionUseCase } from "@infrastructure/dependencies"
import { CommitVersionDTO, schema } from "@application/dto/commit-version"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/http"

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
			statusCode: 202
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}