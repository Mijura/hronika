# Hronika

Hronika is a versioned artifact storage service for the JigJoy AI coding platform. It manages project version history, persisting build and source code artifacts to S3 and tracking version metadata in DynamoDB.

## Architecture

Serverless microservice built with AWS SAM using Clean Architecture (Hexagonal / Ports & Adapters).

**AWS Resources:**
- 3 Lambda functions (Node.js 22.x, 128MB, esbuild-bundled)
- 1 DynamoDB table (`${StackName}-ProjectHistory`)
- 1 S3 bucket (`${StackName}-version-control`) for artifact storage
- IAM roles with `DynamoDBCrudPolicy` + `S3CrudPolicy` per function

**Lambda Functions:**
| Function | Description |
|----------|-------------|
| InitializeProjectHistory | Create a new project history record |
| SaveVersion | Save a project version (artifacts to S3, metadata to DynamoDB) |
| GetLatestVersion | Fetch the latest version for a project |

All function ARNs and the bucket name are exported via CloudFormation outputs for use by `platform-serverless-api` and other services.

### S3 Bucket Architecture Decision

The version control S3 bucket is defined directly in this service's SAM template rather than managed externally via Secrets Manager. This was chosen because:

- **Hronika owns the bucket** - it's the only service that reads/writes to it directly
- **No circular dependency** - the bucket name flows via `!Ref` within the same template, no need to pre-populate a secret before deploying
- **Infrastructure as code** - the bucket lifecycle is managed by CloudFormation (created/deleted with the stack)
- **Other services access versions via API** - project-deployment and spektrum call hronika's Lambda functions through platform-serverless-api (HTTP), they don't access S3 directly

The bucket name is exported as a CloudFormation output (`${StackName}-VersionControlBucketName`). If a future service (e.g., spektrum for undo/redo) ever needs direct S3 access, the bucket name can be:
1. Imported via `Fn::ImportValue` (for SAM/CloudFormation services)
2. Added to the `vars` Secrets Manager secret (for Docker/ECS services)

## Prerequisites

- Node.js 22.x
- AWS SAM CLI
- AWS CLI configured with `spektrum-dev` profile

## Setup

```bash
npm install
```

### GitHub Packages

This project depends on `@jigjoy-ai/serverless-core` and `@jigjoy-ai/file-artifacts` from GitHub Packages. You need a `.npmrc` file in the project root:

```
@jigjoy-ai:registry=https://npm.pkg.github.com
```

Your global `~/.npmrc` must have a GitHub PAT with `read:packages` scope:

```
//npm.pkg.github.com/:_authToken=<your-github-pat>
```

### Environment Variables for Tests

Create a `.env.test` file in the project root (gitignored):

```
AWS_REGION="eu-west-1"
PROJECT_HISTORY_TABLE="spektrum-project-versioning-ProjectHistory"
VERSION_CONTROL_BUCKET="spektrum-project-versioning-version-control"
```

## Running Tests

```bash
# Unit tests only (no AWS credentials needed)
npm test

# All tests including DynamoDB + S3 integration tests (requires AWS credentials + deployed stack)
AWS_PROFILE=spektrum-dev npm test

# Coverage report
npm run coverage
```

**Test breakdown:**
- Domain tests: project history entity, snapshots, version validation
- Application tests: use cases with in-memory repository/storage mocks
- Infrastructure HTTP tests: handler request/response validation, error handling
- Infrastructure storage tests: DynamoDB repository + S3 version storage integration (requires deployed stack)

## Build

```bash
PATH=$PWD/node_modules/.bin:$PATH sam build --profile spektrum-dev
```

## Deploy

**Stack name:** `spektrum-project-versioning`
**Region:** `eu-west-1`
**Profile:** `spektrum-dev`

```bash
sam deploy --profile spektrum-dev --no-confirm-changeset --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

Or using npm scripts:

```bash
npm run build:dev
npm run deploy:dev
```

## Local Development

```bash
# Build and serve locally on port 6000
npm run build:local
npm run serve:local

# API docs on port 6060
npm run docs
```

Local development requires an `env.json` file with Lambda environment variables (gitignored).

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/project-history/initialize` | Initialize a new project history |
| POST | `/project-history/save-version` | Save a project version |
| GET | `/project-history/latest-version/{id}` | Get latest version for a project |
