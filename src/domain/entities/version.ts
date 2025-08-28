import { v4 as uuidv4 } from 'uuid'

export class Version {

    private constructor(
        public readonly id: string,
        public readonly projectId: string,
        public readonly buildArtifactUrl: string,
        public readonly sourceCodeUrl: string,
        public readonly createdAt: string = new Date().toISOString()
    ) {}

    static create(projectId: string, buildArtifactUrl: string, sourceCodeUrl: string): Version {
        return new Version(uuidv4(), projectId, buildArtifactUrl, sourceCodeUrl)
    }

    static rehydrate(data: {id: string, projectId: string, buildArtifactUrl: string, sourceCodeUrl: string, createdAt: string}): Version {
        return new Version(data.id, data.projectId, data.buildArtifactUrl, data.sourceCodeUrl, data.createdAt)
    }
}