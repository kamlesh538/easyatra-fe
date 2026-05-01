# EasyAtra Frontend

Next.js 14 frontend for EasyAtra — an AI-powered Hindu pilgrimage travel assistant. Provides an AI chat interface, trip planner, day-by-day itinerary view, booking notifications, and temple queue time checker.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
- [Pages & Features](#pages--features)
- [Testing](#testing)
- [Docker](#docker)
- [Deployment](#deployment)

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Runtime |
| npm | 10+ | Package management |
| EasyAtra Backend | Running | API server |

---

## Running Locally

### 1. Install dependencies

```bash
cd easyatra_fe
npm install
```

### 2. Create `.env.local` file

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

This points the frontend at the local backend. For production the variable is set to the Cloud Run URL.

### 3. Start the development server

```bash
npm run dev
```

The app is available at `http://localhost:3000`.

> Make sure the backend is running on port 8080 first — see [easyatra_be/README.md](../easyatra_be/README.md).

---

## Pages & Features

| Route | Description |
|-------|-------------|
| `/` | Home page — AI chat modal, queue checker modal, popular destinations, features overview |
| `/planner` | Step-by-step trip creation form (places → dates/budget → traveller info) |
| `/trips/[id]` | Trip detail view with three tabs: Itinerary, Notifications, Queue Times |

### Key components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChatInterface` | `src/components/ChatInterface` | Full-screen AI chat with message history |
| `TripPlanner` | `src/components/TripPlanner` | Multi-step form to create a trip |
| `Itinerary` | `src/components/Itinerary` | Day-by-day itinerary with expandable `DayCard` |
| `Notifications` | `src/components/Notifications` | Booking alert cards with countdown timers |
| `QueueChecker` | `src/components/QueueChecker` | Temple queue time estimator |
| `Navigation` | `src/components/Navigation` | Top navigation bar |

### Environment variable

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the backend API |

---

## Testing

Tests use Jest and React Testing Library. No real API calls are made — the `fetch` global is mocked in each test file.

### Run all tests

```bash
npm test
```

### Run in watch mode (re-runs on file save)

```bash
npm run test:watch
```

### Run with coverage report

```bash
npm run test:coverage
```

Coverage output is written to `coverage/`.

### Run a specific test file

```bash
npx jest __tests__/ChatInterface.test.tsx
```

### Type-check without building

```bash
npx tsc --noEmit
```

---

## Docker

### Build the image

```bash
docker build -t easyatra-fe .
```

The Dockerfile uses a three-stage build (deps → builder → runner) producing a minimal Node.js image using Next.js standalone output.

### Run the container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend-url.run.app \
  easyatra-fe
```

---

## Deployment

### Build for production

To verify the production build locally before deploying:

```bash
npm run build
npm start
```

### CI/CD (GitHub Actions)

A deployment pipeline should be created at `.github/workflows/deploy-frontend.yml` mirroring the backend pipeline. It should trigger on pushes to `main` that change files under `easyatra_fe/**`.

**Recommended pipeline steps:**
1. `npm ci` — install locked dependencies
2. `npm run build` — type-check and build
3. `npm test` — run tests
4. Build and push Docker image to Artifact Registry
5. Deploy to Cloud Run

**Required GitHub secrets** (same as backend):

| Secret | Description |
|--------|-------------|
| `WIF_PROVIDER` | Workload Identity Provider resource name |
| `WIF_SERVICE_ACCOUNT` | GitHub Actions service account email |

### Manual deploy to Cloud Run

```bash
# Authenticate
gcloud auth login
gcloud config set project easyatra
gcloud auth configure-docker asia-south1-docker.pkg.dev

# Build and push
docker build \
  -t asia-south1-docker.pkg.dev/easyatra/easyatra-docker/easyatra-fe:latest .
docker push asia-south1-docker.pkg.dev/easyatra/easyatra-docker/easyatra-fe:latest

# Deploy
gcloud run deploy easyatra-fe \
  --image asia-south1-docker.pkg.dev/easyatra/easyatra-docker/easyatra-fe:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_API_URL=https://easyatra-be-<hash>-as.a.run.app
```

Replace `NEXT_PUBLIC_API_URL` with the actual Cloud Run URL of the backend service, which can be retrieved with:

```bash
gcloud run services describe easyatra-be \
  --region asia-south1 \
  --format='value(status.url)'
```

### CORS

After deploying the frontend, add the frontend URL to the backend's `CORS_ORIGINS` environment variable so the browser can reach the API:

```bash
gcloud run services update easyatra-be \
  --region asia-south1 \
  --update-env-vars CORS_ORIGINS='["https://easyatra-fe-<hash>-as.a.run.app","http://localhost:3000"]'
```
