import { v4 as uuidv4 } from 'uuid'

export class Version {

    private constructor(
        public readonly id: string,
        public readonly projectId: string,
        public readonly artifactPath: string,
        public readonly createdAt: string = new Date().toISOString()
    ) {}

    static create(projectId: string): Version {
        const id = uuidv4()
        const artifactPath = `${projectId}/${id}.tar.gz`
        return new Version(uuidv4(), projectId, artifactPath)
    }

    static rehydrate(data: {id: string, projectId: string, artifactPath: string, createdAt: string}): Version {
        return new Version(data.id, data.projectId, data.artifactPath, data.createdAt)
    }
}