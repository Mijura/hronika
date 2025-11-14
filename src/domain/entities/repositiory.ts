import { v4 as uuidv4 } from 'uuid'
import { Version } from './version'

export class Repository {

    private versions: Version[]
    private latest: Version | null

    private constructor(
        public readonly id: string
    ) {
        this.versions = []
        this.latest = null
    }

    static create(): Repository {
        return new Repository(uuidv4())
    }

    addVersion(): Version {
        const versionId = uuidv4()
        const artifactPath = `${this.id}/${versionId}.tar.gz`
        const version = new Version(versionId, artifactPath)
        this.versions.push(version)
        this.latest = version
        return version
    }

    setLatest(versionId: string) {
        const version = this.versions.find(v => v.id === versionId)
        if (!version) throw new Error("Version not found")
    
        this.latest = version
    }

    getLatest(): Version | null {
        return this.latest
    }
    
    getVersions(): ReadonlyArray<Version> {
        return [...this.versions]
    }

    static rehydrate(data: { id: string; versions: Version[]; latest: Version | null }): Repository {
        const repository = new Repository(data.id)
        repository.versions = data.versions.map(v => Version.rehydrate(v))
        repository.latest = data.latest
        return repository
    }

}