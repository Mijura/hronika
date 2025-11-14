
import { CompressorService } from '@domain/ports/compressor-service'
import { FileArtifacts } from '@jigjoy-io/file-artifacts'
import { Readable } from 'stream'
import * as tar from 'tar-stream'
import * as zlib from 'zlib'

export class TarGzCompressorService implements CompressorService {
    
    async compress(files: FileArtifacts): Promise<Buffer> {
        const pack = tar.pack()

        for (const [filePath, content] of Object.entries(files)) {
        pack.entry({ name: filePath }, content)
        }

        pack.finalize()

        const tarStream = Readable.from(pack)
        const gzip = zlib.createGzip()

        return this.streamToBuffer(tarStream.pipe(gzip))
    }

    async decompress(archive: Buffer): Promise<FileArtifacts> {
        const result: FileArtifacts = {}
        const extract = tar.extract()
        const gunzip = zlib.createGunzip()

        extract.on('entry', (header, stream, next) => {
        let content = ''
        stream.on('data', chunk => (content += chunk.toString()))
        stream.on('end', () => {
            result[header.name] = content
            next()
        })
        stream.resume()
        })

        const stream = Readable.from(archive).pipe(gunzip).pipe(extract)
        await new Promise<void>((resolve, reject) => {
            extract.on('finish', resolve)
            extract.on('error', reject)
        })

        return result
    }

    private streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
        return new Promise((resolve, reject) => {
                const chunks: Buffer[] = []
                stream.on('data', chunk => chunks.push(chunk))
                stream.on('end', () => resolve(Buffer.concat(chunks)))
                stream.on('error', reject)
        })
    }
}


