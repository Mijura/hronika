import { FileArtifacts } from '@jigjoy-io/file-artifacts'

export interface FileArtifactsStorage {

    /**
     * Uploads a file artifact to a bucket and returns the path to the file
     * @param bucket - The bucket to upload the file to
     * @param path - The path to upload the file to
     * @param fileArtifacts - The file artifact to upload
     * @returns void
     */
    upload(bucket: string, path: string, fileArtifacts: FileArtifacts): Promise<void>

    /**
     * Downloads a file artifact from a bucket and returns the file artifact
     * @param bucket - The bucket to download the file from
     * @param archivePath - The path to the file to download
     * @returns The file artifacts
     */
    download(bucket: string, archivePath: string): Promise<FileArtifacts>
}