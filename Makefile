.DEFAULT_GOAL := help
PORT          := 3000
IMAGE         := easyatra-fe

.PHONY: help setup dev build start test test-cov test-watch test-file \
        lint typecheck docker-build docker-run docker-stop clean

help:
	@echo "EasyAtra Frontend"
	@echo ""
	@echo "  setup          Install all dependencies"
	@echo "  dev            Start development server with hot reload"
	@echo "  build          Build for production"
	@echo "  start          Start production server (requires build first)"
	@echo "  test           Run all tests"
	@echo "  test-cov       Run tests with coverage report"
	@echo "  test-watch     Run tests in watch mode"
	@echo "  test-file      Run a single file: make test-file FILE=__tests__/services/api.test.ts"
	@echo "  lint           Run ESLint"
	@echo "  typecheck      Type-check without emitting files"
	@echo "  docker-build   Build Docker image"
	@echo "  docker-run     Run Docker container locally"
	@echo "  docker-stop    Stop and remove running container"
	@echo "  clean          Remove build artefacts and caches"

# ── Setup ─────────────────────────────────────────────────────────────────────

setup:
	npm install
	@if [ ! -f .env.local ]; then cp .env.example .env.local && echo "Created .env.local from .env.example — set NEXT_PUBLIC_API_URL"; fi

# ── Run ───────────────────────────────────────────────────────────────────────

dev:
	npm run dev

build:
	npm run build

start: build
	npm run start

# ── Test ──────────────────────────────────────────────────────────────────────

test:
	npm test -- --passWithNoTests

test-cov:
	npm run test:coverage
	@echo "HTML coverage report: coverage/lcov-report/index.html"

test-watch:
	npm run test:watch

test-file:
	npx jest $(FILE) --verbose

# ── Code quality ──────────────────────────────────────────────────────────────

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

# ── Docker ────────────────────────────────────────────────────────────────────

docker-build:
	docker build -t $(IMAGE) .

docker-run:
	docker run --rm -p $(PORT):3000 \
		-e NEXT_PUBLIC_API_URL=$${NEXT_PUBLIC_API_URL:-http://localhost:8080} \
		--name $(IMAGE) \
		$(IMAGE)

docker-stop:
	docker stop $(IMAGE) 2>/dev/null || true
	docker rm $(IMAGE) 2>/dev/null || true

# ── Clean ─────────────────────────────────────────────────────────────────────

clean:
	rm -rf .next out coverage node_modules/.cache
