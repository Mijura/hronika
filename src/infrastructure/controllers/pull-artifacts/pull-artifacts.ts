import Responses from "@infrastructure/http/api-responses"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ValidationError } from "@infrastructure/http/error-handler/errors/validation-error"
import { errorHandler } from "@infrastructure/http/error-handler"
import { schemaValidator } from "@infrastructure/http/schema-validator"

export async function pullArtifactsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        //schemaValidator(schema, user)

		let response = {
			statusCode: 202,
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}