import axios from "axios"

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
    
    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    async initializeProjectHistory(): Promise<string> {

		try {
			const res = await axios.post(
				`${this.endpoint}/initialize-project-history`,
				{}
			  )
			return res.data
		} catch (error) {
			console.error("Error initializing project history:", error)
			throw error
		}
	}

    async saveVersion(version: VersionDTO): Promise<void> {
		try {


			const payload = JSON.parse(JSON.stringify(version))

			await axios.post(
				`${this.endpoint}/save-version`,
				payload
			)

		} catch (error) {
			console.error("Error saving version:", error)
			throw error
		}
	}

    async getLatestVersion(projectHistoryId: string): Promise<VersionDTO> {
		
		try {
		  const res = await axios.get<VersionDTO>(
			`${this.endpoint}/get-latest-version/${projectHistoryId}`
		  )
	  
		  return res.data
		} catch (error: any) {
		  console.error("Error fetching latest version:", error)
	  
		  // Optional: preserve meaningful HTTP error info
		  if (axios.isAxiosError(error)) {
			throw new Error(
			  	`Failed to fetch latest version: ${error.response?.status} ${error.response?.statusText}`
			)
		  }
	  
		  throw error
		}
	  }
}