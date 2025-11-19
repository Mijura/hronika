
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { saveVersionUseCase } from "@infrastructure/dependencies"
import { VersionDTO, schema } from "@application/dto/version"
import { Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { errorHandler } from "@infrastructure/http/error-handler"

export async function saveVersionHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const version: VersionDTO = JSON.parse(body)
        schemaValidator(schema, version)

		await saveVersionUseCase.execute(version)

		return Responses._201()
	} catch (error) {
		return errorHandler(error)
	}
}