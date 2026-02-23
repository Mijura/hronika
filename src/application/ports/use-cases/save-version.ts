import { Version } from "@domain/project-history/version/version"
import { UserData } from "@jigjoy-ai/auth"
import { AuthenticatedUseCase } from "@heksagon/app"

export type SaveVersionParams = {
	version: Version
}

export type SaveVersionUseCase = AuthenticatedUseCase<UserData, SaveVersionParams, Version>