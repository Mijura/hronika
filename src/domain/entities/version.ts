export class Version {

    constructor(
        public readonly id: string,
        public readonly artifactPath: string,
        public readonly createdAt: string = new Date().toISOString()
    ) {}

    static rehydrate(data: { id: string; artifactPath: string; createdAt: string; }): Version {    
        return new Version(data.id, data.artifactPath, data.createdAt)
    }

}