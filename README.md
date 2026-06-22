# Health Coach

Health Coach is a mobile AI health optimization product. It helps users turn health data, daily state, lifestyle context, nutrition, supplements, and progress feedback into clear actions for energy, mood, motivation, productivity, sleep, recovery, and general well-being.

The repository documentation is organized for iterative product development. Codex or another coding agent should not rebuild the product from scratch unless explicitly asked by the owner. New work should start from the current app state, inspect the existing routes/components first, and then make small, testable changes.

## Current Product Direction

The active product model uses five primary mobile tabs:

```text
Today / Supplements / Body / AI / Profile
```

Secondary modules may be opened from those tabs or from onboarding:

```text
Analyses
Braverman assessment
Supplement catalog
My supplements
Nutrition
Weekly plan
Progress review
Settings
```

Goals are user preferences and progress targets. They are not a separate primary tab and should not be treated as a standalone main navigation item unless the product owner asks for that change.

## Documentation Source Order

Read documents in this order when planning or implementing changes:

1. [`docs/CURRENT_SOURCE_OF_TRUTH.md`](docs/CURRENT_SOURCE_OF_TRUTH.md)
2. [`docs/PRODUCT_SCOPE.md`](docs/PRODUCT_SCOPE.md)
3. [`docs/CODEX_CONTEXT.md`](docs/CODEX_CONTEXT.md)
4. [`docs/REPO_IMPLEMENTATION_STATUS.md`](docs/REPO_IMPLEMENTATION_STATUS.md)
5. [`docs/UX_ARCHITECTURE.md`](docs/UX_ARCHITECTURE.md)
6. [`docs/USER_FLOW.md`](docs/USER_FLOW.md)
7. [`docs/CODEX_TASK.md`](docs/CODEX_TASK.md)
8. Engine and domain documents in `/docs`
9. [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md)
10. [`docs/PRODUCT_VISION.md`](docs/PRODUCT_VISION.md) and [`docs/MONETIZATION.md`](docs/MONETIZATION.md)
11. [`docs/MVP.md`](docs/MVP.md), only as a deprecated historical note

If documents conflict, follow `CURRENT_SOURCE_OF_TRUTH.md` first.

## Project Areas

```text
HealthCoach/
├── app/                         # Expo Router routes in the full app checkout
├── src/                         # Shared components, theme, services, types
├── docs/                        # Product and technical documentation
├── supabase/                    # Database migrations and Edge Functions
├── assets/                      # Images and UI references
├── package.json
├── app.json / app.config.*
├── tsconfig.json
└── .env.example
```

This documentation archive may contain only docs, `.env.example`, and selected Supabase schema references. Before changing routes or implementation details, inspect the full app checkout rather than relying on route names from documentation alone.

## Environment Variables

Copy `.env.example` to `.env` for local development.

Client-safe variables:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Server-only variables:

```text
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
PAYMENT_PROVIDER_SECRET_KEY=
```

Local or backend-owned variables:

```text
APP_ENV=development
```

Do not expose AI provider keys, payment secrets, or service-role keys inside the mobile app. AI calls must go through Supabase Edge Functions or another secure backend layer.

## Product Safety Principle

Health Coach must not diagnose diseases, promise cures, or present recommendations as medical treatment. Health, nutrition, supplement, and bee product guidance must stay informational and should encourage consultation with a qualified healthcare professional when biomarkers, symptoms, medications, pregnancy, breastfeeding, allergies, or other risk factors make that appropriate.
