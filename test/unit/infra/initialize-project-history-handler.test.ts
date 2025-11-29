// test/unit/infra/http/initialize-project-history-handler.test.ts

import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"

import { InMemoryProjectHistoryRepository } from "@app/adapters/outbound/in-memory-project-history-repo"
import { InitializeProjectHistoryUseCase } from "@app/use-cases/initialize-project-history"
import { ProjectHistoryRepository } from "@app/ports/outbound/project-history-repository"
import { createInitializeProjectHistoryHandler } from "@infra/http/factories/initialize-project-history-handler"
import { InitializeProjectHistory } from "@app/ports/inbound/initialize-project-history"


describe("Initialize Project History Handler", () => {

    let initializeProjectHistoryUseCase: InitializeProjectHistoryUseCase
    let repository: ProjectHistoryRepository
    let handler: (event: APIGatewayProxyEvent) => Promise<any>

    beforeEach(() => {
        repository = new InMemoryProjectHistoryRepository()
        initializeProjectHistoryUseCase = new InitializeProjectHistoryUseCase(repository)

        // we use the real use case here (still unit-ish, all in-memory)
        handler = createInitializeProjectHistoryHandler(
            initializeProjectHistoryUseCase as InitializeProjectHistory,
        )
    })

    it("returns 201 and a new project history id", async () => {
        const event = {} as APIGatewayProxyEvent // handler doesn't use event

        const result = await handler(event)

        expect(result.statusCode).toBe(201)

        const body = JSON.parse(result.body)
        expect(typeof body).toBe("string")
        expect(body.length).toBeGreaterThan(0)

        // Optional: assert that repo actually has a record for that id
        const stored = await repository.get(body)
        expect(stored).not.toBeNull()
    })

    it("propagates errors from use case through errorHandler", async () => {
        // create a handler with a fake use case that always throws
        const failingUseCase: InitializeProjectHistory = {
        execute: async () => {
            throw new Error("boom")
        }}

        const failingHandler = createInitializeProjectHistoryHandler(failingUseCase)

        const result = await failingHandler()

        // depending on your errorHandler mapping this might be 500 or something else
        expect(result.statusCode).toBe(500)
    });
});
