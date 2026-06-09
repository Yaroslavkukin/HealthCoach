# Supabase

This folder contains the MVP database migration and Edge Function placeholders.

Recommended order:

1. Create Supabase project.
2. Run `migrations/0001_initial_schema.sql`.
3. Create Storage buckets listed in `/docs/DATABASE_SCHEMA.md`.
4. Deploy Edge Functions after AI prompts are finalized.

Do not call OpenAI directly from the mobile app.
