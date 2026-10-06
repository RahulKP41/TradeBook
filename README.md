# TradeBook

An AI-powered Trading Performance Intelligence Platform.

> Record → Understand → Improve.

## Tech stack

- **Frontend:** Next.js + TypeScript + Tailwind CSS + shadcn/ui + Recharts
- **Backend:** Node.js + Express + TypeScript + Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (HTTP-only cookies)
- **AI:** LLM API with structured JSON output
- **DevOps:** Docker + Docker Compose + Jenkins + Docker Hub + Azure

## Quick start (dev)

```bash
docker compose up -d postgres
cp .env.example .env
# edit .env with your values
npx prisma migrate dev
npm run dev
```

## Project structure

```
apps/web/    # Next.js frontend
apps/api/    # Express backend
infra/       # Azure / Docker configs
docs/        # Architecture & docs
tests/       # Unit & integration
e2e/         # Playwright tests
```

## Stages

1. Foundation
2. Backend + DB
3. Auth
4. Trading accounts & trades
5. Journal & analytics
6. Behaviour engine
7. AI integration
8. Frontend
9. Testing
10. CI/CD & Azure

## License

MCA academic project / learning use.
