import { Version } from "@domain/project-history/version/version"

export interface GetLatestVersion {
	/**
	 * Retrieves the latest version of a project.
	 *
	 * @param projectHistoryId - The unique identifier of the project history
	 * @returns A promise that resolves to the latest version with build and source code artifacts
	 */
	execute(projectHistoryId: string): Promise<Version>
}
