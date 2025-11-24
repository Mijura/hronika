import { createSaveVersionHandler } from "../factories/save-version"
import { saveVersionUseCase } from "@infra/dependencies"

export const handler = createSaveVersionHandler(saveVersionUseCase)