import { FileArtifacts } from "@jigjoy-io/file-artifacts"

export interface CompressorService {

    /**
     * Compresses a file artifact and returns a buffer
     * @param fileArtifacts - The file artifact to compress
     * @returns The compressed file artifacts
     */
    compress(fileArtifacts: FileArtifacts): Promise<Buffer>

    /**
     * Decompresses a buffer and returns a file artifacts
     * @param archive - The buffer to decompress
     * @returns The decompressed file artifacts
     */
    decompress(archive: Buffer): Promise<FileArtifacts>
}