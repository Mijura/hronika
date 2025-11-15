import { v4 as uuidv4 } from 'uuid'
import { Version } from './version'

export class Repository {

    private versions: Version[]
    private latestVersionId: string | null

    private constructor(
        public readonly id: string
    ) {
        this.versions = []
        this.latestVersionId = null
    }

    static create(): Repository {
        return new Repository(uuidv4())
    }

    addVersion(): Version {
        const versionId = uuidv4()
        const buildPath = `${this.id}/artifacts/${versionId}.tar.gz`
        const sourceCodePath = `${this.id}/sources/${versionId}.tar.gz`
        const version = new Version(versionId, buildPath, sourceCodePath)
        this.versions.push(version)
        this.latestVersionId = version.id
        return version
    }

    setLatest(versionId: string) {
        const exists = this.versions.some(v => v.id === versionId)
        if (!exists) throw new Error("Version not found in this repository")
        this.latestVersionId = versionId
    }

    getLatest(): Version | null {
        if (!this.latestVersionId) return null
        return this.versions.find(v => v.id === this.latestVersionId) ?? null
    }
    
    getVersions(): ReadonlyArray<Version> {
        return [...this.versions]
    }

    static rehydrate(data: {
        id: string
        versions: any[]
        latestVersionId: string | null
      }): Repository {
        const repository = new Repository(data.id)
        repository.versions = data.versions.map(v => Version.rehydrate(v))
        repository.latestVersionId = data.latestVersionId
        return repository
      }

}