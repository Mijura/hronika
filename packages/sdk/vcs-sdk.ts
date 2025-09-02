import { FileArtifacts } from "@honeycomb-app/file-artifacts"
import { JIGJOY_VCS_ENDPOINT } from "./config"

export class JigJoyVCS {

    private readonly endpoint: string
    
    constructor() {
        this.endpoint = JIGJOY_VCS_ENDPOINT
    }

    async createRepository(): Promise<string> {
		try {
			const response = await fetch(`${this.endpoint}/create-repository`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				}
			})

			if (!response.ok) {
				throw new Error(`Failed to create repository: ${response.statusText}`)
			}

			return await response.json() as string
		} catch (error) {
			console.error("Error creating repository:", error)
			throw error
		}
	}

    async commitVersion(repositoryId: string, fileArtifacts: FileArtifacts): Promise<void> {
		try {
			const response = await fetch(`${this.endpoint}/commit-version`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
                body: JSON.stringify({ repositoryId, fileArtifacts })
			})

			if (!response.ok) {
				throw new Error(`Failed to commit version: ${response.statusText}`)
			}
		} catch (error) {
			console.error("Error committing version:", error)
			throw error
		}
	}

    async pullArtifacts(repositoryId: string): Promise<FileArtifacts> {

		try {
			const response = await fetch(`${this.endpoint}/pull-artifacts/${repositoryId}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				throw new Error(`Failed to pull artifacts: ${response.statusText}`)
			}

			return await response.json() as FileArtifacts
		} catch (error) {
			console.error("Error pulling artifacts:", error)
			throw error
		}
	}
}