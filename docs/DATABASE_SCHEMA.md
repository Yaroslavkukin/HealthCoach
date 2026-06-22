# DATABASE_SCHEMA.md

## Project

Health Coach

## Purpose

This document describes the intended Health Coach data model at product level.

It must be read together with:

```text
/docs/CURRENT_SOURCE_OF_TRUTH.md
supabase/migrations/0001_initial_schema.sql
```

The migration file is an implementation artifact. Documentation-only changes must not edit migration code.


## Migration Review Notes

The included initial migration is an implementation artifact and should be reviewed in a dedicated code/schema pass before being applied to a real database.

During this documentation recheck, no duplicate column names were found in the included migration. Earlier documentation notes that mentioned duplicate `completed_at` or duplicate `user_id` fields were incorrect and have been removed.

Still verify the migration separately during a database task, including migration compatibility, row-level security behavior, generated type updates if the project uses them, and whether lookup tables should be public-read or server-managed.

The migration may contain comments or reserved tables from earlier drafts. Those artifacts do not change the active product scope in `CURRENT_SOURCE_OF_TRUTH.md`.

## Product Navigation Context

The data model supports the current target navigation:

```text
Today / Supplements / Body / AI / Profile
```

It must not force a standalone Goal tab, Clinic flow, marketplace checkout, or delivery flow.

## Core Principles

### User-Owned Data

Most tables are owned by a user through `user_id` or directly through `profiles.id`.

### Privacy First

Health data, lab files, biomarker results, symptoms, AI outputs, and chat messages are sensitive.

Use:

- row-level security;
- least-privilege access;
- server-side AI calls;
- minimal prompt/data storage;
- clear consent records;
- deletion/export path when product policy requires it.

### AI Outputs Are Separate

AI-generated profiles, summaries, recommendations, and chat messages should be stored separately from raw user inputs.

This allows:

- regeneration;
- versioning;
- audit;
- user corrections;
- safety review.

### Non-Diagnostic Model

The database may store statuses, scores, explanations, and recommendation categories.

It must not imply that Health Coach stores clinical diagnoses unless a separate regulated clinical feature is explicitly created.

## Current Migration Table Inventory

The included migration currently defines these tables:

```text
profiles
user_delivery_profiles
user_consents
subscription_plans
subscriptions
payments
user_goals
onboarding_checklist
blood_test_uploads
blood_test_results
biomarker_catalog
biomarker_results
braverman_assessments
braverman_results
lifestyle_assessments
nutrition_assessments
ai_health_profiles
health_system_scores
ai_summaries
recommendations
supplement_recommendations
bee_product_recommendations
nutrition_plans
action_plans
daily_tasks
progress_reviews
ai_chat_sessions
ai_chat_messages
notifications
```

## Active Product Groups

### Profile and Consent

Tables:

```text
profiles
user_consents
```

Purpose:

- identity-linked profile details;
- localization basics;
- onboarding flags;
- consent tracking.

Do not store unnecessary medical details directly in `profiles` if a more specific table exists.

### Reserved / Legacy Delivery Table

Table:

```text
user_delivery_profiles
```

Status:

```text
reserved / legacy
```

This table exists in the included migration, but delivery address collection is not an active UX requirement.

Do not build required delivery onboarding, supplement shipment, marketplace checkout, or automatic delivery flows unless commerce/delivery scope is explicitly added.

### Subscription and Payment

Tables:

```text
subscription_plans
subscriptions
payments
```

Purpose:

- subscription plan metadata;
- user access state;
- payment records or provider references.

Payment secrets and webhooks must be backend-owned.

Pricing should remain configurable.

### Goals and Setup

Tables:

```text
user_goals
onboarding_checklist
```

Purpose:

- user outcome goals;
- setup progress;
- AI profile readiness.

Goals are product data, not a standalone bottom-tab requirement.

### Blood Analysis and Biomarkers

Tables:

```text
blood_test_uploads
blood_test_results
biomarker_catalog
biomarker_results
```

Purpose:

- uploaded lab file references;
- extracted raw text or structured extraction;
- biomarker catalog;
- user biomarker values, units, reference ranges, status, and AI explanation.

Rules:

- support missing biomarkers;
- preserve lab-provided units and ranges where available;
- allow manual correction;
- use non-diagnostic status language;
- do not expose raw file URLs insecurely.

### Braverman

Tables:

```text
braverman_assessments
braverman_results
```

Purpose:

- assessment completion state;
- dominant/secondary profile;
- attention areas;
- motivation archetype;
- raw scores;
- AI/personality summary if generated.

Rules:

- do not present neurotransmitter scores as a medical diagnosis;
- keep copy careful and motivational.

### Lifestyle and Nutrition Inputs

Tables:

```text
lifestyle_assessments
nutrition_assessments
```

Purpose:

- subjective symptoms;
- work/activity/sleep/stress context;
- nutrition description;
- food habit notes;
- constraints and preferences.

These inputs support Today, AI, recommendations, nutrition guidance, and profile confidence.

### AI Health Profile and Scores

Tables:

```text
ai_health_profiles
health_system_scores
ai_summaries
```

Purpose:

- overall state;
- energy/mood/motivation/productivity scores;
- confidence score;
- body system scores;
- AI summary cards.

Rules:

- store generated JSON only after validation;
- include confidence/missing-data context;
- keep medical safety note.

### Recommendations

Tables:

```text
recommendations
supplement_recommendations
bee_product_recommendations
nutrition_plans
```

Purpose:

- general recommendations;
- supplement stack details;
- bee product guidance;
- nutrition plan JSON.

Rules:

- recommendations must have category, priority, confidence, reason, expected benefit, and safety note when relevant;
- restricted medical products must not appear as ordinary user-facing supplement recommendations;
- bee products must include allergy warnings;
- nutrition plans must not be framed as medical diet therapy.

### Plans and Daily Tasks

Tables:

```text
action_plans
daily_tasks
```

Purpose:

- weekly or multi-day plan;
- daily task checklist;
- Today screen tasks;
- completion tracking.

Tasks can cover:

- sleep;
- nutrition;
- supplements;
- activity;
- stress management;
- recovery;
- retesting;
- professional-evaluation prompts.

### Progress Reviews

Table:

```text
progress_reviews
```

Purpose:

- 14-day review;
- user-reported scores;
- symptoms;
- free-text feedback;
- AI adjustment JSON.

Reviews should drive recommendation adaptation.

### AI Chat

Tables:

```text
ai_chat_sessions
ai_chat_messages
```

Purpose:

- contextual AI conversations;
- user and assistant messages;
- metadata for safety/context.

Rules:

- store only what product policy allows;
- avoid storing unnecessary raw prompts with sensitive data;
- never expose provider keys;
- validate/sanitize AI output before user display.

### Notifications

Table:

```text
notifications
```

Purpose:

- reminders;
- progress review prompts;
- supplement schedule prompts;
- analysis processing completion;
- plan updates.

Tone must remain supportive and non-alarmist.

## Enum Guidance

The migration defines enums for:

- gender;
- subscription status;
- subscription plan codes;
- upload status;
- analysis package codes;
- biomarker status;
- health system codes;
- recommendation category;
- recommendation priority;
- recommendation confidence;
- stack type;
- task status;
- AI message role.

When extending enums, check migration compatibility and app code usage first.

## RLS Guidance

Every user-owned table should enforce row-level security.

Expected pattern:

```text
user can read/write only rows where auth.uid() owns the row
```

Admin/service operations must happen server-side with service role credentials and must never be exposed to the mobile client.

## Storage Buckets

Likely storage needs:

```text
blood-test-uploads
profile-photos
food-photos
documents
```

Rules:

- blood analysis files are sensitive;
- use private buckets unless a specific public asset use case exists;
- signed URLs should be time-limited;
- deletion should remove or anonymize related sensitive records according to policy.

## AI Generation Logging

When implemented, AI generation logging should track:

- user id;
- feature name;
- provider;
- model;
- created time;
- validation result;
- error state;
- token/cost metadata if needed.

Avoid storing full sensitive prompts unless required and explicitly approved.

## Data Completeness Logic

AI confidence should consider whether these exist:

- profile basics;
- goals;
- lifestyle and symptoms;
- nutrition preferences;
- blood analysis;
- Braverman result;
- progress history;
- supplement context.

Low confidence should not block all value, but it must be visible to the user.

## Safety Rules

The schema should support safety notes for:

- supplement recommendations;
- bee products;
- nutrition plans;
- biomarker interpretation;
- AI summaries;
- recommendations that suggest professional evaluation.

Recommendation categories may include `medical_consultation` or similar professional-evaluation prompts, but the app must not state that the user has a diagnosis.

## Implementation Notes

Before changing migrations:

1. compare this document with the actual full repo migration history;
2. check generated types if the project uses them;
3. plan migration compatibility;
4. update docs and tests;
5. run database checks in a safe environment.

Do not change database migrations during documentation-only review.
