export class ProjectSnapshot {

    constructor(
        public readonly id: string,
        public readonly buildPath: string,
        public readonly sourceCodePath: string,
        public readonly createdAt: string = new Date().toISOString()
    ) {}

    static rehydrate(data: { 
        id: string
        buildPath: string 
        sourceCodePath: string 
        createdAt: string 
    }): ProjectSnapshot {    
        return new ProjectSnapshot(data.id, data.buildPath, data.sourceCodePath, data.createdAt)
    }

}