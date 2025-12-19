# @jigjoy-io/project-versioning-client

SDK for interacting with JigJoy's Project Versioning service. It exposes a thin wrapper around the REST endpoints responsible for creating project histories, saving new versions, and retrieving the latest version metadata along with its artifacts.

## Installation

```sh
npm install @jigjoy-io/project-versioning-client
```

## Configuration

Set `PROJECT_ARTIFACTS_ENDPOINT` to point at the Project Versioning API. The client defaults to the production URL, but providing the env var lets you target staging or local stacks:

```sh
export PROJECT_ARTIFACTS_ENDPOINT="https://example.execute-api.region.amazonaws.com/Prod"
```

## Quick Start

```ts
import { ProjectVersioningClient } from "@jigjoy-io/project-versioning-client"

const client = new ProjectVersioningClient()

async function shipBuild() {
  const projectHistoryId = await client.initializeProjectHistory()

  await client.saveVersion({
    projectHistoryId,
    buildArtifacts: { "dist/index.js": "/* ... */" },
    sourceCodeArtifacts: { "src/index.ts": "/* ... */" },
  })

  const latest = await client.getLatestVersion(projectHistoryId)
  console.log(latest)
}
```

## API

- `initializeProjectHistory(): Promise<string>` – creates a new history and returns its `projectHistoryId`.
- `saveVersion(version: VersionDTO): Promise<void>` – sends build and source artifacts for a specific `projectHistoryId`.
- `getLatestVersion(projectHistoryId: string): Promise<VersionDTO>` – fetches the last saved version.

All operations throw on non-2xx responses, so wrap them in your own error handling logic where appropriate.

