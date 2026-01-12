import { describe, it, expect } from "@rstest/core"
import { errorHandler } from "@infra/http/error-handler"
import { ValidationError } from "@jigjoy-io/serverless-core"
import { ProjectHistoryNotFound } from "@app/errors/project-history-not-found"

describe("Error Handler", () => {
	it("returns 400 for ValidationError", () => {
		const error = new ValidationError("Validation failed")
		const result = errorHandler(error)

		expect(result.statusCode).toBe(400)
		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Validation failed")
	})

	it("returns 404 for ProjectHistoryNotFoundError", () => {
		const error = new ProjectHistoryNotFound("test-id")
		const result = errorHandler(error)

		expect(result.statusCode).toBe(404)
		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Project history not found: test-id")
	})

	it("returns 500 for generic Error", () => {
		const error = new Error("Something went wrong")
		const result = errorHandler(error)

		expect(result.statusCode).toBe(500)
		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Something went wrong")
	})

	it("returns 500 for non-Error types", () => {
		const result = errorHandler("string error")
		expect(result.statusCode).toBe(500)
		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Something went wrong")
	})

	it("returns 500 for null", () => {
		const result = errorHandler(null)
		expect(result.statusCode).toBe(500)
		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Something went wrong")
	})

	it("returns 500 for undefined", () => {
		const result = errorHandler(undefined)
		expect(result.statusCode).toBe(500)
		const body = JSON.parse(result.body)
		expect(body.errorMessage).toBe("Something went wrong")
	})
})
