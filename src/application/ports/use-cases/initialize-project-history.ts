import { UserData } from "@jigjoy-ai/auth"
import { AuthenticatedUseCase } from "@heksagon/app"

export type InitializeProjectHistoryUseCase = AuthenticatedUseCase<UserData, void, string>