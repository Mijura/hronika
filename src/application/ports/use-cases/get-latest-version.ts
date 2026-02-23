import { Version } from "@domain/project-history/version/version"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type GetLatestVersionParams = {
	projectHistoryId: string
}

export type GetLatestVersionUseCase = AuthenticatedUseCase<UserData, GetLatestVersionParams, Version>