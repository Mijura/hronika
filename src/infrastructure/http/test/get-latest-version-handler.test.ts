import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"

import { GetLatestVersionUseCase } from "@app/ports/use-cases/get-latest-version"
import { createGetLatestVersionHandler } from "@infra/http/factories/get-latest-version-handler"
import { Version } from "@domain/project-history/version/version"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"

describe("Get Latest Version Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and version data when projectHistoryId is provided", async () => {
		const mockVersion: Version = {
			projectHistoryId: "test-project-id",
			buildArtifacts: {
				"dist/index.js": "!function(){console.log('minified')}();",
				"dist/styles.css": ".container{display:flex;width:100%}",
				"dist/vendor.js": "!function(e,t){(e.exports=t())}(this,function(){return{}});",
			},
			sourceCodeArtifacts: {
				"src/index.ts": "export function main() {\n  console.log('Hello, World!');\n}",
				"src/components/Button.tsx":
					"import React from 'react';\n\nexport const Button = () => <button>Click me</button>;",
				"package.json": '{\n  "name": "my-app",\n  "version": "1.0.0"\n}',
			},
		}

		const mockUseCase: GetLatestVersionUseCase = {
			execute: async () => mockVersion,
		}

		handler = createGetLatestVersionHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectHistoryId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)
		expect(body.projectHistoryId).toBe("test-project-id")
		expect(body.buildArtifacts).toEqual(mockVersion.buildArtifacts)
		expect(body.sourceCodeArtifacts).toEqual(mockVersion.sourceCodeArtifacts)
	})

	it("returns 400 when projectHistoryId is missing", async () => {
		const mockUseCase: GetLatestVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetLatestVersionHandler(mockUseCase)

		const event = {
			pathParameters: {},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Missing required path parameter: projectHistoryId")
	})

	it("returns 400 when pathParameters is undefined", async () => {
		const mockUseCase: GetLatestVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createGetLatestVersionHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Missing required path parameter: projectHistoryId")
	})

	it("returns 404 when ProjectHistoryNotFound is thrown", async () => {
		const mockUseCase: GetLatestVersionUseCase = {
			execute: async () => {
				throw new ProjectHistoryNotFound("non-existent-id")
			},
		}

		handler = createGetLatestVersionHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectHistoryId: "non-existent-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(404)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Project history not found: non-existent-id")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: GetLatestVersionUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createGetLatestVersionHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectHistoryId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Something went wrong")
	})
})
