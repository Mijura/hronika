import { v4 as uuidv4 } from 'uuid'
import { Version } from './version'

export class Repository {

    private versions: Version[]
    private currentVersionId: string | null

    private constructor(
        public readonly id: string
    ) {
        this.versions = []
        this.currentVersionId = null
    }

    static create(): Repository {
        return new Repository(uuidv4())
    }

    addVersion(): Version {
        const versionId = uuidv4()
        const artifactPath = `${this.id}/${versionId}.tar.gz`
        const version = new Version(versionId, artifactPath)
        this.versions.push(version)
        this.currentVersionId = version.id
        return version
    }

    setCurrentVersion(versionId: string) {
        const exists = this.versions.some(v => v.id === versionId)
        if (!exists) throw new Error("Version not found")
    
        this.currentVersionId = versionId
    }

    getCurrentVersionId(): string | null {
        return this.currentVersionId
    }

    getCurrentVersion(): Version | null {
        return this.versions.find(v => v.id === this.currentVersionId) || null
    }
    
    getVersions(): ReadonlyArray<Version> {
        return [...this.versions]
    }

    static rehydrate(data: { id: string; versions: Version[]; currentVersionId: string | null }): Repository {
        const repository = new Repository(data.id)
        repository.versions = data.versions.map(v => Version.rehydrate(v))
        repository.currentVersionId = data.currentVersionId
        return repository
    }

}