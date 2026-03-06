import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"

import { SaveVersionUseCase } from "@app/ports/use-cases/save-version"
import { createSaveVersionHandler } from "@infra/http/factories/save-version-handler"
import { Version } from "@domain/project-history/version/version"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"

describe("Save Version Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 201 and saved version data when valid version is provided", async () => {
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

		const mockUseCase: SaveVersionUseCase = {
			execute: async () => mockVersion,
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "test-project-id",
				buildArtifacts: mockVersion.buildArtifacts,
				sourceCodeArtifacts: mockVersion.sourceCodeArtifacts,
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)
		expect(body.projectHistoryId).toBe("test-project-id")
		expect(body.buildArtifacts).toEqual(mockVersion.buildArtifacts)
		expect(body.sourceCodeArtifacts).toEqual(mockVersion.sourceCodeArtifacts)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when body is null", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: null,
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when body is empty string", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: "",
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when projectHistoryId is missing", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				buildArtifacts: {
					"dist/index.js": "minified code",
				},
				sourceCodeArtifacts: {
					"src/index.ts": "source code",
				},
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)
	})

	it("returns 400 when buildArtifacts is missing", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "test-project-id",
				sourceCodeArtifacts: {
					"src/index.ts": "source code",
				},
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)
	})

	it("returns 400 when sourceCodeArtifacts is missing", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "test-project-id",
				buildArtifacts: {
					"dist/index.js": "minified code",
				},
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)
	})

	it("returns 400 when buildArtifacts is not an object", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "test-project-id",
				buildArtifacts: "not an object",
				sourceCodeArtifacts: {
					"src/index.ts": "source code",
				},
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)
	})

	it("returns 400 when sourceCodeArtifacts is not an object", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "test-project-id",
				buildArtifacts: {
					"dist/index.js": "minified code",
				},
				sourceCodeArtifacts: "not an object",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)
	})

	it("returns 400 when body contains invalid JSON", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: "invalid json {",
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)
	})

	it("returns 404 when ProjectHistoryNotFound is thrown", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new ProjectHistoryNotFound("non-existent-id")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "non-existent-id",
				buildArtifacts: {
					"dist/index.js": "minified code",
				},
				sourceCodeArtifacts: {
					"src/index.ts": "source code",
				},
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(404)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Project history not found: non-existent-id")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: SaveVersionUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createSaveVersionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectHistoryId: "test-project-id",
				buildArtifacts: {
					"dist/index.js": "minified code",
				},
				sourceCodeArtifacts: {
					"src/index.ts": "source code",
				},
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Something went wrong")
	})
})
