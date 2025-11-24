import { createGetLatestVersionHandler } from "@infra/http/factories/get-latest-version"
import { getLatestVersionUseCase } from "@infra/dependencies"

export const handler = createGetLatestVersionHandler(getLatestVersionUseCase)