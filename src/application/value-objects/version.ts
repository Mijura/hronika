import { FileArtifacts } from "./file-artifacts"

export class Version {

    constructor(
        readonly projectHistoryId: string, 
        readonly buildArtifacts: FileArtifacts, 
        readonly sourceCodeArtifacts: FileArtifacts){}
}