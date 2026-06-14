# Health Coach

Health Coach is a mobile AI health coach MVP designed to help users improve energy, emotional state, motivation, productivity, sleep, nutrition, recovery, and general well-being.

The repository is prepared for Codex-driven development and contains:

- Product documentation in `/docs`
- Expo React Native application scaffold
- Supabase schema and Edge Function placeholders
- Mock UI screens based on the current product concept
- AI engine placeholders for later implementation

## Current Status

This repository is a **Milestone 1 scaffold**:

- Expo / React Native structure is prepared.
- TypeScript is configured.
- Navigation structure is created.
- Main MVP screens are present as placeholders with mock data.
- Supabase client setup is prepared.
- Database migration file is included.
- AI functions are intentionally placeholders.

The next step is to open this repository in Codex and implement the MVP step by step using `/docs/CODEX_TASK.md`.

## Recommended Development Flow

Do not ask Codex to build the whole product at once.

Start with:

```text
Read all files in /docs.
Implement Phase 1 from /prompts/CODEX_PHASE_1.md.
Do not implement AI, payments, or database writes yet.
After finishing, explain what was created and what should be tested.
```

Then continue by phases:

1. App shell and navigation
2. Mock-data clickable prototype
3. Supabase database and storage
4. Auth and subscription flow
5. AI Health Profile generation
6. First user testing workflow

## Project Structure

```text
HealthCoach/
├── app/                         # Expo Router routes
├── src/                         # Shared components, theme, services, types
├── docs/                        # Product and technical documentation
├── supabase/                    # Database migration and Edge Functions
├── assets/                      # Images and UI references
├── prompts/                     # Codex phase prompts
├── package.json
├── app.json
├── tsconfig.json
└── .env.example
```

## Setup

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm run start
```

Run type check:

```bash
npm run typecheck
```

## Environment Variables

Copy `.env.example` to `.env`.

```bash
cp .env.example .env
```

Client-safe variables:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

Do not expose AI provider API keys inside the mobile app. AI calls should go through Supabase Edge Functions or a secure backend.

## Important Safety Principle

Health Coach must not diagnose diseases or present recommendations as medical treatment.

All supplement and health recommendations must include appropriate safety language and encourage consultation with a qualified healthcare professional when relevant.
