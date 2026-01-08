# Docker Deployment

This project includes Docker support for easy deployment.

## Quick Start

### Pull from GitHub Container Registry

```bash
# Pull the latest version
docker pull ghcr.io/atharvaunde/traefik-dash:latest

# Or pull a specific version
docker pull ghcr.io/atharvaunde/traefik-dash:0.1.0
```

### Run the Container

```bash
docker run -d \
  -p 3000:3000 \
  -e TRAEFIK_API_URL=http://your-traefik-host:8080 \
  --name traefik-dash \
  ghcr.io/atharvaunde/traefik-dash:latest
```

### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  traefik-dash:
    image: ghcr.io/atharvaunde/traefik-dash:latest
    ports:
      - "3000:3000"
    environment:
      - TRAEFIK_API_URL=http://traefik:8080
    restart: unless-stopped
```

Then run:

```bash
docker compose up -d
```

## Building Locally

### Build the Image

```bash
docker build -t traefik-dash .
```

### Run Local Build

```bash
docker run -d -p 3000:3000 -e TRAEFIK_API_URL=http://localhost:8080 traefik-dash
```

## Environment Variables

- `TRAEFIK_API_URL` - The URL of your Traefik API (default: `http://localhost:8080`)
- `PORT` - The port the app listens on (default: `3000`)
- `NODE_ENV` - Environment mode (set to `production` in container)

## Release Process

This project uses GitHub Actions to automate releases and container publishing.

### Creating a Release

1. Go to **Actions** tab in GitHub
2. Select **Release and Publish** workflow
3. Click **Run workflow**
4. Choose version bump type:
   - `patch` - for bug fixes (0.1.0 → 0.1.1)
   - `minor` - for new features (0.1.0 → 0.2.0)
   - `major` - for breaking changes (0.1.0 → 1.0.0)
5. Click **Run workflow**

The workflow will:
- ✅ Bump version in `package.json`
- ✅ Create a git tag
- ✅ Generate release notes from commits
- ✅ Create a GitHub release
- ✅ Build multi-platform Docker images (amd64, arm64)
- ✅ Push to GitHub Container Registry
- ✅ Tag images with version and `latest`

## Available Tags

Images are tagged with:
- `latest` - always points to the most recent release
- `<version>` - specific version (e.g., `0.1.0`)
- `<major>.<minor>` - minor version (e.g., `0.1`)
- `<major>` - major version (e.g., `0`)

## Multi-Architecture Support

The Docker images support both:
- `linux/amd64` - for x86_64 systems
- `linux/arm64` - for ARM systems (e.g., Apple Silicon, Raspberry Pi)

Docker will automatically pull the correct architecture for your system.
