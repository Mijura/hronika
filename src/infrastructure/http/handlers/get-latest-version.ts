import { createGetLatestVersionHandler } from "@infra/http/factories/get-latest-version-handler"
import { getLatestVersionUseCase } from "@infra/dependencies"

export const handler = createGetLatestVersionHandler(getLatestVersionUseCase)
