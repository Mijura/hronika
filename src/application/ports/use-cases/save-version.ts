import { Version } from "@domain/project-history/version/version"

export interface SaveVersion {
	/**
	 * Saves a new version snapshot to the project history.
	 *
	 * @param version - The version containing project history ID, build artifacts, and source code artifacts
	 * @returns A promise that resolves saved version
	 */
	execute(version: Version): Promise<Version>
}
