# CODEX_TASK.md

## Project

Health Coach

## Purpose

This file is the execution brief for Codex or any coding assistant.

Health Coach is an existing product direction, not a blank project. Continue the current product in small, safe, reviewable steps.

## Read First

Before changing code or docs, read:

```text
/docs/CURRENT_SOURCE_OF_TRUTH.md
/docs/PRODUCT_SCOPE.md
/docs/CODEX_CONTEXT.md
/docs/REPO_IMPLEMENTATION_STATUS.md
/docs/UX_ARCHITECTURE.md
/docs/USER_FLOW.md
/docs/CODEX_TASK.md
```

Then read the domain docs relevant to the task:

```text
/docs/ANALYSIS_SYSTEM.md
/docs/AI_RECOMMENDATION_ENGINE.md
/docs/SUPPLEMENTS_ENGINE.md
/docs/BEE_PRODUCTS_ENGINE.md
/docs/BRAVERMAN_ENGINE.md
/docs/BRAVERMAN_TEST_RESEARCH_AND_IMPLEMENTATION.md
/docs/HEALTH_SCORE_ENGINE.md
/docs/NUTRITION_ENGINE.md
/docs/MONETIZATION.md
/docs/DATABASE_SCHEMA.md
```

`docs/MVP.md` is deprecated and must not drive implementation.

## Documentation Priority

When documents conflict, use this order:

1. `CURRENT_SOURCE_OF_TRUTH.md`
2. `PRODUCT_SCOPE.md`
3. `CODEX_CONTEXT.md`
4. `REPO_IMPLEMENTATION_STATUS.md`
5. `UX_ARCHITECTURE.md`
6. `USER_FLOW.md`
7. `CODEX_TASK.md`
8. Domain engine documents
9. `DATABASE_SCHEMA.md`
10. `PRODUCT_VISION.md` and `MONETIZATION.md`
11. Deprecated docs such as `MVP.md`

## Product Summary

Health Coach helps users improve:

- energy;
- emotional state;
- motivation;
- productivity;
- sleep;
- recovery;
- nutrition;
- supplement adherence;
- general well-being.

The product uses:

- user profile;
- goals and preferences;
- symptoms;
- lifestyle data;
- nutrition preferences and constraints;
- blood analysis uploads or manual biomarker input;
- Braverman assessment;
- supplement routine;
- progress reviews;
- AI chat context.

Core principle:

```text
Today first. The user should immediately understand what to do today.
```

## Target Platform

Expected stack in a full app checkout:

```text
Frontend: React Native + Expo + TypeScript
Navigation: Expo Router
Backend: Supabase
Database: PostgreSQL via Supabase
Authentication: Supabase Auth
Storage: Supabase Storage
AI: DeepSeek through backend/server functions
Payments: backend-owned payment provider abstraction
```

Do not hardcode secrets in frontend code.

## Main Navigation

Target bottom navigation:

```text
Today / Supplements / Body / AI / Profile
```

Do not add a standalone `Goal` bottom tab.

Do not add `Clinic`, marketplace, or delivery flows unless the owner explicitly requests a scope change.

## Screen Ownership

### Today

Implement and refine:

- current state summary;
- health score / core scores;
- daily priorities;
- daily checklist;
- AI insight;
- weekly plan entry;
- goal progress summary;
- progress review entry.

### Supplements

Implement and refine:

- My Supplements;
- supplement catalog;
- recommended stack;
- schedule and intake logging;
- bee products when safe and relevant;
- supplement safety notes.

### Body

Implement and refine:

- body systems;
- system score cards;
- biomarker detail screens;
- analyses upload/history;
- Braverman result and assessment entry;
- AI health profile entry.

### AI

Implement and refine:

- contextual chat;
- safe recommendations explanation;
- links back to Today, Body, Supplements, Nutrition, and Profile;
- professional-evaluation escalation wording when needed.

### Profile

Implement and refine:

- personal profile;
- goals and preferences;
- symptoms and lifestyle updates;
- nutrition preferences and constraints;
- subscription state;
- settings;
- consent and privacy;
- progress history.

## Implementation Rules

Before coding:

1. inspect the full current code tree;
2. verify actual route names under `app/`;
3. verify existing shared components and theme tokens;
4. verify Supabase client and Edge Functions;
5. verify package scripts and dependency versions;
6. choose the smallest useful change.

During coding:

- do not rebuild the app from scratch;
- do not duplicate existing components without reason;
- preserve current route names unless a route migration is explicitly part of the task;
- keep UI consistent with existing theme;
- validate AI outputs before rendering;
- handle loading, empty, error, partial-data, and active states;
- keep provider keys server-side;
- keep medical safety wording visible where relevant.

After coding:

- run `npm run typecheck` when available;
- run `npm run lint` when available;
- report any commands that could not run and why;
- list changed files;
- list manual test steps.

## Environment Variables

Client-safe variables:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Local or backend-owned variables:

```text
APP_ENV=development
```

Server-only variables:

```text
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
PAYMENT_PROVIDER_SECRET_KEY=
```

Only variables prefixed with `EXPO_PUBLIC_` may be used by the mobile client. If a payment provider later requires a publishable key in the client, add a clearly named `EXPO_PUBLIC_...` variable during a dedicated payment task.

## AI Architecture

AI calls should follow this pattern:

```text
Expo client -> Supabase Edge Function / secure backend -> AI provider -> validated response -> Expo client
```

The app should not:

- call DeepSeek directly from client code;
- store provider keys in client-accessible env variables;
- render unvalidated AI JSON;
- expose raw prompts with sensitive user data unnecessarily;
- use provider names in user-facing copy unless intentionally required.

## Database Guidance

Use `docs/DATABASE_SCHEMA.md` for product-level data modeling.

Use migrations only during code/database tasks, not during documentation-only review.

Every user-owned table should have ownership constraints and row-level security policies.

Sensitive health data should be minimized, protected, and deleted/exported according to product privacy requirements.

## Safety Requirements

Health Coach must not:

- diagnose disease;
- claim to treat or cure disease;
- replace qualified medical care;
- give emergency advice as a substitute for emergency services;
- recommend prescription medication or controlled substances as ordinary supplements;
- recommend injectables, SARMs, peptides, experimental compounds, or restricted medical products as wellness supplements.

Health Coach should:

- use non-diagnostic language;
- explain confidence levels;
- flag incomplete data;
- recommend professional evaluation for potentially serious findings;
- include supplement and nutrition safety notes;
- consider pregnancy, breastfeeding, medication use, chronic conditions, allergies, eating-disorder risk, and high-risk biomarkers.

## Recommended Development Slices

Use small slices such as:

1. align bottom tabs with current navigation;
2. polish Today screen states;
3. implement one Supplements subsection;
4. implement one Body system detail flow;
5. connect Braverman result display;
6. connect analyses upload/history UI;
7. implement `ai-chat` backend call and safe fallback;
8. add AI response validation;
9. add weekly plan generation from mock or stored data;
10. add progress review capture;
11. improve Profile preferences and safety constraints;
12. add tests or type coverage for one engine.

Do not ask Codex to implement the entire product in one pass.

## Definition of Done

A change is done when:

- it respects `CURRENT_SOURCE_OF_TRUTH.md`;
- it does not introduce old navigation or deprecated product scope;
- TypeScript passes when tooling is available;
- lint passes when tooling is available;
- runtime loading/error/empty states are handled;
- user-facing copy is safety-aware;
- no secrets are exposed to the client;
- changed files and manual test steps are reported.
