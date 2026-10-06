# 02 — System Design

## Architecture overview

```
┌─────────────┐     HTTPS      ┌──────────────┐
│   Browser   │ ──────────────▶ │ Next.js Web  │  apps/web
└─────────────┘                 └──────┬───────┘
                                      │ API (same origin / proxy)
                                      ▼
                              ┌──────────────┐
                              │ Express API  │  apps/api
                              └──────┬───────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
            ┌──────────┐   ┌────────────┐   ┌──────────┐
            │ Prisma   │   │  LLM API   │   │  Azure   │
            │  (ORM)   │   │ (external) │   │ Monitor  │
            └────┬─────┘   └────────────┘   └──────────┘
                 │
                 ▼
         ┌───────────────┐
         │  PostgreSQL   │
         └───────────────┘
```

## Modules

| Module | Path | Responsibility |
|---|---|---|
| Web | `apps/web` | Next.js frontend, pages, components |
| API | `apps/api` | Express routes, controllers, services, repositories |
| Shared | `apps/api/src/shared` | types, validation, errors, auth middleware |
| Analytics | `apps/api/src/services/analytics` | deterministic P&L, drawdown, streaks |
| Behaviour | `apps/api/src/services/behaviour` | rule-based detection |
| AI | `apps/api/src/services/ai` | context builder, LLM call, structured output |
| Infra | `infra` | Dockerfiles, compose, Azure configs |

## Request flow

```
Request
  → Route (router)
  → Controller (parse + validate)
  → Service (business logic)
  → Repository (Prisma calls)
  → PostgreSQL
```

## Data ownership

Every row in `users`, `trading_accounts`, `trades`, `journals`,
`strategies`, `trade_strategies`, `behaviour_events`, `ai_insights` is
owned by a user. Every read/write path must enforce `userId = current user`.
A user must never access another user's data.

## Determinism rule

All financial statistics are computed in application code from raw trade
data. The LLM receives pre-computed metrics and explains them — it never
calculates them.

## Deployment targets

| Env | Orchestration |
|---|---|
| Dev | `docker compose up` |
| Prod | Azure Container Apps + Azure Database for PostgreSQL Flexible Server |

## Roadmap

- Stage 4: Docker + PostgreSQL
- Stage 5: Backend foundation
- Stage 6: Prisma schema
- Stage 7: Auth
- Stage 8: Accounts
- Stage 9: Trades + journal
- Stage 10: Frontend
- Stage 11-14: Dashboard, analytics, strategies, behaviour
- Stage 15: AI
- Stage 16-19: Testing, Jenkins, Docker Hub, Azure