import { createSaveVersionHandler } from "../factories/save-version-handler"
import { saveVersionUseCase } from "@infra/dependencies"

export const handler = createSaveVersionHandler(saveVersionUseCase)