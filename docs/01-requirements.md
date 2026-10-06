# 01 — Requirements

## Product

**TradeBook** — "An AI-powered Trading Performance Intelligence Platform."

Core principle: **Record → Understand → Improve.**

TradeBook is NOT a stock-price prediction system. It is a trading performance
intelligence platform that helps a trader understand:

- What happened?
- Why did it happen?
- What behavioural patterns are appearing?
- Which strategies perform well?
- Which mistakes are repeated?
- How can the trader improve their process?

AI recommendations must focus on trading process, discipline, review, risk
awareness, and behavioural improvement. Never generate guaranteed buy/sell
predictions.

## Functional requirements

### FR-001 Accounts
- A user can create multiple trading accounts.
- Accounts are user-owned; other users must never see them.

### FR-002 Trades
- Record full trade lifecycle: entry price, exit price, quantity, times,
  stop loss, take profit, risk amount, fees, status.
- Compute gross P&L, net P&L, and R multiple in application code.

### FR-003 Journal
- Each trade can have a journal entry with: entry reason, exit reason,
  emotions (before/during/after), confidence, market observation, rules
  followed, mistakes, lessons, notes.

### FR-004 Strategies
- User-defined strategies.
- A trade can be linked to one or more strategies.

### FR-005 Analytics
- Deterministic, testable analytics computed in application code:
  total P&L, daily P&L, win rate, profit factor, average win/loss, average R,
  expectancy, trade count, max drawdown, equity curve, winning/losing streaks.

### FR-006 Behaviour engine (rule-based v1)
- Detect: FOMO, Revenge Trading, Overtrading, Rule Violation.
- Each event has: behaviour type, confidence score, evidence, trade reference,
  detection time.
- Never state uncertain classifications as absolute facts.

### FR-007 AI integration
- AI explains patterns found by the application.
- AI is never the source of truth for financial calculations.
- Structured JSON output validated with Zod before use.

### FR-008 Authentication
- Register / login / logout / me.
- JWT in HTTP-only cookies.
- Password hashing (bcrypt/argon2).

### FR-009 API
- REST endpoints for all resources.
- Consistent success/error response envelope.

### FR-010 Frontend
- Pages: login, register, dashboard, trades, analytics, behaviour, AI review,
  settings.

## Non-functional requirements

| Area | Requirement |
|---|---|
| Security | Password hashing, JWT, ownership checks, input validation, rate limiting, secure cookies, HTTPS |
| Data | Money uses numeric types; no careless float arithmetic |
| Testability | Unit, integration, E2E |
| Observability | Logs, health checks, Azure Monitor |
| Deploy | Docker + Docker Compose; Jenkins CI/CD; Azure Container Apps |

## Out of scope (v1)

- Real-time market data feeds
- Broker integrations
- ML models (rule-based behaviour only)
- Redis caching
- Multi-tenancy beyond per-user isolation