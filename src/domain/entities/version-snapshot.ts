import { v4 as uuidv4 } from 'uuid'

export class VersionSnapshot {

    constructor(
        public readonly id: string,
        public readonly buildPath: string,
        public readonly sourceCodePath: string,
        public readonly createdAt: string = new Date().toISOString()
    ) {}

    static create(buildPath: string, sourceCodePath: string): VersionSnapshot {
        const snapshotId = uuidv4()
        return new VersionSnapshot(snapshotId, buildPath, sourceCodePath)

    }

    static rehydrate(data: { 
        id: string
        buildPath: string 
        sourceCodePath: string 
        createdAt: string 
    }): VersionSnapshot {    
        return new VersionSnapshot(data.id, data.buildPath, data.sourceCodePath, data.createdAt)
    }

}