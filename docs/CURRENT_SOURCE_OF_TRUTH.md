# CURRENT_SOURCE_OF_TRUTH.md

## Purpose

This file is the highest-priority documentation file for Health Coach.

If any document conflicts with this file, use this file and update the conflicting document.

## Review Snapshot

Reviewed package type:

```text
documentation-only archive
```

Confirmed contents in this package:

- root `README.md`;
- `/docs` product and technical documentation;
- `.env.example`;
- `supabase/migrations/0001_initial_schema.sql`.

Not confirmed from this documentation-only package:

- actual Expo route tree;
- current React Native components;
- current package scripts;
- installed dependencies;
- runtime behavior of Supabase Edge Functions;
- production payment integration;
- production AI integration.

When doing code work, always inspect the full project checkout before changing routes, imports, scripts, or Edge Functions.

## Product Definition

Health Coach is an active mobile AI health coach product.

It helps users understand their state and act on it through:

- Today plan;
- blood analysis interpretation;
- Braverman-based personalization;
- body system overview;
- biomarker details;
- supplement routines;
- bee product recommendations;
- nutrition guidance;
- AI chat;
- weekly plans;
- progress reviews;
- profile and subscription management.

The product should not be described as an early-stage starter project or one-pass initial build in active planning docs.

## Main Navigation

The target bottom navigation is:

```text
Today / Supplements / Body / AI / Profile
```

### Today

Primary daily action surface.

Owns:

- daily priorities;
- core scores;
- daily checklist;
- weekly plan entry;
- goal progress summary;
- progress review entry;
- short AI insight.

### Supplements

Owns:

- My Supplements;
- supplement catalog;
- supplement schedule;
- supplement recommendations;
- bee products as a supportive wellness category;
- safety notes and contraindication prompts.

### Body

Owns:

- body systems;
- health system scores;
- biomarker details;
- blood analysis upload/history;
- Braverman result and assessment entry;
- AI health profile summary entry.

### AI

Owns:

- contextual AI assistant;
- explanations of recommendations;
- user questions about Today, Body, Supplements, Nutrition, and Profile data;
- safety-aware refusal/escalation wording.

### Profile

Owns:

- personal data;
- goals and preferences;
- symptoms and lifestyle updates;
- nutrition preferences and constraints;
- subscription state;
- settings;
- privacy and consent;
- progress history.

## Goal Model

`Goal` is a product concept, not a main bottom-tab destination.

Goals may appear in:

- Today;
- Weekly Plan;
- Progress Review;
- AI explanations;
- Profile settings/history.

Do not add or document a standalone `Goal` bottom tab unless the product owner explicitly changes the navigation model.

## Nutrition Model

`Nutrition` is a product capability.

It can appear as:

- Today meal guidance;
- Profile preferences and constraints;
- AI chat context;
- recommendation category;
- internal screen opened from Today, Supplements, Body, or AI.

Do not make `Nutrition` a primary bottom-tab label unless the product owner explicitly requests it.

User-facing label:

```text
Nutrition
```

Use one clear user-facing nutrition label and avoid legacy route/file labels in copy unless compatibility requires them.

## Out of Scope Unless Explicitly Requested

Do not implement or document as active scope:

- clinic marketplace;
- clinic booking;
- laboratory marketplace checkout;
- supplement e-commerce checkout;
- automatic supplement or bee product delivery;
- delivery address collection as a required onboarding step;
- product shipment tracking;
- affiliate checkout flow;
- Apple Health / Google Fit integration as an active dependency;
- clinician portal;
- full medical record system.

Some older schema drafts or migrations may contain reserved tables for delivery or future commerce. Those tables are not active UX requirements.

## AI Provider Boundary

Health Coach uses backend-owned AI calls.

Rules:

- do not expose AI keys in the Expo client;
- use Supabase Edge Functions or another secure backend for AI calls;
- keep provider details out of user-facing copy;
- use `.env.example` for required variable names;
- DeepSeek variables are currently documented as the provider configuration;
- do not add provider-specific references unless the owner explicitly changes provider direction.

## Database Boundary

`docs/DATABASE_SCHEMA.md` describes the intended data model.

`supabase/migrations/0001_initial_schema.sql` is an implementation artifact included for reference in this docs package.

Documentation-only work must not edit migration code. If the product scope changes, update docs first and handle migrations separately during a code/database task.

## Safety Boundary

Health Coach is not a diagnostic or treatment product.

The product may:

- explain biomarkers in plain language;
- identify wellness-oriented limiting factors;
- suggest lifestyle, sleep, nutrition, supplement, and bee product actions;
- recommend retesting or professional evaluation when appropriate.

The product must not:

- diagnose diseases;
- claim to treat or cure diseases;
- replace clinicians;
- provide emergency advice as a substitute for care;
- recommend prescription drugs, controlled substances, injectables, SARMs, peptides, or experimental compounds as ordinary supplements;
- ignore pregnancy, breastfeeding, medication use, chronic conditions, allergies, eating disorder risks, or high-risk lab values.

## Documentation Priority Order

Use this priority order when documents disagree:

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

## Documentation Quality Rules

Active docs should not contain:

- old staged-build or starter-project framing;
- instructions to run missing phase-prompt files;
- `Goal` as a standalone main navigation destination;
- active clinic or delivery flows;
- claims that full implementation exists unless verified in the full code checkout;
- direct frontend AI-key usage;
- medical diagnosis or treatment claims.
