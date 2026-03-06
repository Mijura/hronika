import { VersionStorage } from "@app/ports/storage/version-storage"
import { S3VersionStorage } from "./s3-version-storage"

const bucket = process.env.VERSION_CONTROL_BUCKET
if (!bucket) throw new Error("Missing VERSION_CONTROL_BUCKET env variable")

export const versionStorage: VersionStorage = new S3VersionStorage(bucket)
