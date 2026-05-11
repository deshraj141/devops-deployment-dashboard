# DevOps Deployment Monitoring Dashboard

Professional MERN Stack DevOps application for centralized deployment tracking and CI/CD visibility.

## Project Title

DevOps Deployment Monitoring Dashboard

## What This Project Does

This application helps developers and DevOps teams monitor project deployments in one place. It tracks:

- Projects and repository links
- Container image registry and tags
- Deployment statuses across environments
- Deployment logs and activity history
- Analytics summary of success/failure/build queues

## Core Features

- JWT authentication with login/register
- Dashboard analytics cards:
  - Total Projects
  - Successful Deployments
  - Failed Deployments
  - Pending Builds
  - Running Containers
  - Latest Deployment Activity
- Project management (CRUD)
- Deployment management (CRUD)
- Deployment history with search/filter
- Deployment details page with logs
- Dark, glassmorphism, responsive DevOps UI
- Dockerized frontend, backend, and MongoDB
- CI/CD pipelines for Docker Hub and GHCR

## Tech Stack

- MongoDB
- Express.js
- React.js + Vite
- Node.js
- Tailwind CSS
- Docker
- Docker Compose
- GitHub Actions
- Jenkins
- Docker Hub
- GHCR

## Project Structure

```text
client/
server/
docker-compose.yml
Jenkinsfile
.github/workflows/ci-cd.yml
README.md
```

## Architecture Diagram (Text)

```text
Developer Browser
      |
      v
React Dashboard (NGINX container)
      |
      | /api
      v
Express API (Node container)
      |
      +--> MongoDB (mongo container + persistent volume)

CI/CD Path:
GitHub Commit/PR
  -> GitHub Actions (install, build, test, docker build)
  -> Push images to Docker Hub and GHCR
  -> Jenkins pipeline deploy with Docker Compose
```

## Backend API Summary

### Authentication APIs

- POST /api/auth/register
- POST /api/auth/login

### Project APIs

- GET /api/projects
- POST /api/projects
- PUT /api/projects/:id
- DELETE /api/projects/:id

### Deployment APIs

- GET /api/deployments
- GET /api/deployments/:id
- POST /api/deployments
- PUT /api/deployments/:id
- DELETE /api/deployments/:id

### Analytics API

- GET /api/analytics/dashboard

### Health Endpoint

- GET /health

## Deployment Status Values

- Pending
- Building
- Success
- Failed

## Data Fields Covered

Each deployment stores:

- projectName
- repoUrl
- imageName
- imageTag
- registry (Docker Hub or GHCR)
- environment (Development/Staging/Production)
- deploymentUrl
- deployedBy
- deploymentStatus
- logs
- createdAt

## Local Setup (Windows PowerShell)

### 1. Clone and Open

```powershell
git clone <your-repository-url>
Set-Location .\ProjDocker
```

### 2. Create Environment Files

```powershell
Copy-Item .\server\.env.example .\server\.env
Copy-Item .\client\.env.example .\client\.env
```

### 3. Run With Docker Compose

```powershell
docker compose up --build
```

### 4. Open URLs

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health: http://localhost:5000/health

### 5. Stop Stack

```powershell
docker compose down
```

## Docker Commands (Manual)

```powershell
# Build backend image
docker build -t <dockerhub-username>/devops-dashboard-backend:latest .\server

# Build frontend image
docker build -t <dockerhub-username>/devops-dashboard-frontend:latest .\client

# Push images
docker push <dockerhub-username>/devops-dashboard-backend:latest
docker push <dockerhub-username>/devops-dashboard-frontend:latest
```

## Docker Compose Improvements Included

- Persistent MongoDB volume
- Restart policies on all services
- Health checks on MongoDB, backend, and frontend
- Service startup ordering with health-based dependencies
- Environment variable support through .env files and fallback values

## GitHub Actions Workflow Explanation

Workflow file: .github/workflows/ci-cd.yml

Pipeline steps:

1. Checkout code
2. Install backend dependencies
3. Install frontend dependencies
4. Run backend checks
5. Run backend tests
6. Build frontend
7. Build Docker images
8. Push backend/frontend images to Docker Hub
9. Push backend/frontend images to GHCR

Required secrets:

- DOCKERHUB_USERNAME
- DOCKERHUB_TOKEN
- GHCR_USERNAME
- GHCR_TOKEN

## Jenkins Pipeline Explanation

Pipeline file: Jenkinsfile

Stages:

1. Clone repository
2. Install dependencies
3. Build frontend
4. Test backend
5. Build backend Docker image
6. Build frontend Docker image
7. Push images to Docker Hub
8. Deploy with Docker Compose

Jenkins prerequisites:

- Jenkins host with Docker and Docker Compose installed
- Credential ID dockerhub-creds configured as username/password

### Recommended Jenkins container setup

The default `jenkins/jenkins:lts` image does not include Node.js or the Docker CLI, so the pipeline will fail at the install/build stages unless you provide those tools.

Use the custom Jenkins image in `jenkins/Dockerfile` and mount the Docker socket from the host:

```powershell
docker build -t devops-jenkins .\jenkins
docker run -d --name jenkins `
   -p 8080:8080 `
   -p 50000:50000 `
   -v jenkins_home:/var/jenkins_home `
   -v /var/run/docker.sock:/var/run/docker.sock `
   devops-jenkins
```

If you keep the plain Jenkins image, install Node.js and Docker tooling separately before running the pipeline.

## Screenshots Required for Submission

1. Login page
2. Register page
3. Dashboard analytics cards
4. Projects page with list
5. Project create/edit modal
6. Add Deployment page form
7. Deployment History table with filters
8. Deployment Details page with logs
9. Running containers from docker compose ps
10. GitHub Actions successful run
11. Jenkins successful pipeline stages
12. Docker Hub pushed images
13. GHCR pushed images

## Viva Questions and Answers

1. Why is this called a deployment monitoring dashboard?
   - Because it centralizes deployment metadata, status tracking, and release activity for multiple projects.

2. Why use JWT authentication?
   - JWT keeps APIs stateless and protects project/deployment endpoints with token-based authorization.

3. Why store deployment logs in the database?
   - It preserves deployment context for debugging, postmortems, and audit history.

4. Why are environment values modeled as enums?
   - Enums enforce consistent values for Development, Staging, and Production.

5. Why add health checks in Docker Compose?
   - Health checks improve startup sequencing and ensure services are actually ready before dependencies start.

6. Why keep both Jenkins and GitHub Actions?
   - GitHub Actions gives native repo automation, while Jenkins supports customizable enterprise CD workflows.

7. Why push to Docker Hub and GHCR?
   - Multi-registry publishing improves portability, backup strategy, and ecosystem compatibility.

8. How does frontend connect to backend in containers?
   - NGINX serves the React build and proxies /api traffic to the backend service.

9. What is the purpose of a persistent MongoDB volume?
   - It keeps deployment and project data safe across container restarts and rebuilds.

10. What command runs the full local stack?
   - docker compose up --build

## Beginner Notes

- Set a strong JWT_SECRET before production deployment.
- Update Docker Hub username values in Jenkinsfile.
- Add richer backend tests as your deployment logic grows.
- Keep image tags meaningful (latest, commit SHA, release version).
