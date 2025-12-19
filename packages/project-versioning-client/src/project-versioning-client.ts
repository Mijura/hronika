
import { PROJECT_VERSIONING_ENDPOINT } from "./config"

type FileArtifacts = {
    [filePath: string]: string
}

type VersionDTO = { 
	projectHistoryId: string, 
	buildArtifacts: FileArtifacts, 
	sourceCodeArtifacts: FileArtifacts
}

export class ProjectVersioningClient {

    private readonly endpoint: string
    
    constructor() {
        this.endpoint = PROJECT_VERSIONING_ENDPOINT
    }

    async initializeProjectHistory(): Promise<string> {
		try {
			const response = await fetch(`${this.endpoint}/initialize-project-history`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				}
			})

			if (!response.ok) {
				throw new Error(`Failed to initialize project history: ${response.statusText}`)
			}

			return await response.json() as string
		} catch (error) {
			console.error("Error initializing project history:", error)
			throw error
		}
	}

    async saveVersion(version: VersionDTO): Promise<void> {
		try {
			const response = await fetch(`${this.endpoint}/save-version`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify(version)
			})

			if (!response.ok) {
				throw new Error(`Failed to save verion: ${response.statusText}`)
			}
		} catch (error) {
			console.error("Error saving version:", error)
			throw error
		}
	}

    async getLatestVersion(projectHistoryId: string): Promise<VersionDTO> {

		try {
			const response = await fetch(`${this.endpoint}/get-latest-version/${projectHistoryId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to fetch latest version: ${response.statusText}`)
			}

			return await response.json() as VersionDTO
		} catch (error) {
			console.error("Error fetching latest version:", error)
			throw error
		}
	}
}