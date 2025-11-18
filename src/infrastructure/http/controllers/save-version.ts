
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveVersionUseCase } from "@infrastructure/dependencies"
import { VersionDTO, schema } from "@application/dto/version"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"

export async function saveVersionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const version: VersionDTO = JSON.parse(body)
        schemaValidator(schema, version)

		try {
			await saveVersionUseCase.execute(version)
		} catch (error) {
			throw new Error(`Failed to : ${error}`)
		}

		let response = {
			statusCode: 202
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}