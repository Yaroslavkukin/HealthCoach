# UX_ARCHITECTURE.md

## Project

Health Coach

## Purpose

This document defines the current UX architecture, navigation model, screen ownership, screen states, and interaction principles for Health Coach.

It follows `CURRENT_SOURCE_OF_TRUTH.md`.

## Core UX Philosophy

Health Coach should feel like a calm, premium, practical coach.

The user should not be forced to interpret complex biomarkers or scattered recommendations.

The interface should answer:

```text
How am I doing?
What matters most?
What should I do today?
Why does this action matter?
What should I do next?
```

Main principle:

```text
Today first.
```

## Visual Direction

Recommended feel:

- calm;
- clean;
- premium;
- trustworthy;
- action-oriented;
- not clinical or intimidating.

Avoid:

- dense medical dashboards;
- alarmist colors and copy;
- raw lab-data overload;
- excessive gamification;
- claims that sound diagnostic or therapeutic.

## Main Navigation

Bottom navigation:

```text
Today / Supplements / Body / AI / Profile
```

### Today

Daily plan and current state.

### Supplements

Supplement stack, schedule, catalog, safety, and bee products.

### Body

Body systems, biomarkers, analyses, Braverman, and AI health profile.

### AI

Contextual assistant.

### Profile

User data, goals, preferences, subscription, privacy, and settings.

## Secondary Sections

Secondary sections open from cards, tabs, or buttons inside the main areas:

- Weekly Plan;
- Progress Review;
- AI Summary;
- Blood Analysis Upload;
- Blood Analysis History;
- Biomarker Detail;
- Braverman Assessment;
- Braverman Result;
- Nutrition Guidance;
- My Supplements;
- Supplement Catalog;
- Supplement Detail;
- Bee Product Detail;
- Subscription;
- Settings;
- Privacy and Consent.

`Goal` is not a main tab. Goals appear inside Today, Weekly Plan, AI, and Profile.

`Clinic`, marketplace checkout, and delivery are not active UX sections.

## Global Screen States

Every major screen should support these states.

### Preview State

Used before personalization or for demo mode.

Shows clearly labeled example data.

CTA examples:

- Start Health Coach
- Complete Setup
- Unlock Personal Plan

### Empty State

Used when no data exists yet.

Example:

```text
Your personalized insights will appear after you complete your initial assessment.
```

### Partial Data State

Used when only some inputs are available.

Example:

```text
This recommendation is based on your questionnaire. Upload blood analysis for higher confidence.
```

### Processing State

Used when AI or extraction is running.

Example:

```text
Building your Health Profile...
```

### Active State

Used when personalized data is available.

Shows current scores, priorities, recommendations, and actions.

### Error State

Used when upload, extraction, AI, auth, payment, or network steps fail.

Must include:

- what happened;
- whether user data is safe;
- next step;
- retry or support option.

### Expired / Limited Access State

Used when subscription access is not active.

The user may view limited history if product rules allow it, but new AI generation and personal updates should require active access.

## Onboarding Architecture

The initial setup should collect only data needed for personalization.

Recommended flow:

1. first launch / preview;
2. account or subscription flow according to current business rules;
3. profile basics;
4. goals and preferences;
5. lifestyle and symptoms;
6. nutrition preferences and constraints;
7. blood analysis upload or manual input;
8. Braverman assessment;
9. AI processing;
10. AI Summary;
11. Today.

Do not require delivery address as a standard onboarding step.

## Today Screen

### Today — Purpose

Show the user exactly what matters today.

### Today — Core Blocks

- greeting and date;
- current state / health score;
- core scores: energy, mood, motivation, productivity;
- top limiting factor;
- today priorities;
- daily checklist;
- supplement reminders;
- nutrition prompt;
- weekly plan entry;
- progress review entry when due;
- AI insight;
- CTA to ask AI.

### UX Rule

Today should be useful even when data is partial.

If confidence is low, show why and what data would improve confidence.

## Supplements Screen

### Supplements — Purpose

Help the user follow a safe and realistic supplement routine.

### Recommended Structure

Tabs or sections:

```text
My Supplements / Catalog / Schedule / Bee Products
```

### Card Content

A supplement card should include:

- name;
- purpose;
- reason;
- confidence;
- timing;
- dose text when available;
- food instruction;
- compatibility notes;
- safety note;
- status or next intake.

### Safety Rule

Supplement recommendations must not look like prescriptions.

Show professional-consultation guidance for users with medical conditions, medication use, pregnancy, breastfeeding, allergies, or other risk factors.

## Body Screen

### Body — Purpose

Explain the user's body systems and health data without overwhelming them.

### Body — Core Blocks

- overall health score;
- system cards;
- biomarker highlights;
- analysis status;
- Braverman card;
- AI Health Profile card;
- missing-data guidance.

### Body Systems

Recommended system categories:

- Hormonal;
- Thyroid;
- Metabolic;
- Nutritional;
- Stress & Recovery;
- Inflammation;
- Sleep;
- Digestive.

### System Card Content

- score or status;
- confidence;
- main explanation;
- key related biomarkers;
- related symptoms;
- recommended next action;
- link to detail.

## Biomarker Detail Screen

### Biomarker Detail — Purpose

Explain one biomarker in a clear, non-diagnostic way.

### Biomarker Detail — Sections

- latest value and unit;
- reference range as provided by lab when available;
- trend;
- status;
- what it may relate to;
- what can influence it;
- related systems;
- actions or retesting guidance;
- safety note.

### Copy Rule

Use language like:

```text
This may be associated with...
This can be worth discussing with a qualified professional...
```

Avoid language like:

```text
You have...
This means you are diagnosed with...
This treatment will...
```

## Blood Analysis Screens

### Upload / Input

Supported UX options:

- PDF upload;
- image upload;
- manual biomarker input;
- package selection;
- preparation guidance.

### History

Show:

- analysis date;
- package or custom label;
- extraction status;
- confidence or review status;
- link to biomarker results;
- ability to re-upload or correct data.

## Braverman Screens

### Assessment

Use a long-form but manageable flow:

- progress indicator;
- one-question or small-batch steps;
- save/resume if persistence exists;
- neutral wording;
- no diagnostic language.

### Result

Show:

- dominant profile;
- secondary profile when relevant;
- attention areas;
- motivation archetype;
- coaching style;
- how this changes recommendations;
- safety note.

## AI Summary Screen

### AI Summary — Purpose

Give a clear explanation of the user's current state after initial profile generation or major updates.

### AI Summary — Sections

- current limiting factors;
- what creates the biggest expected impact;
- expected effect;
- confidence level;
- next best action;
- safety note;
- CTA to Today;
- CTA to ask AI.

## Nutrition UX

Nutrition is a capability, not a primary bottom tab by default.

It may appear through:

- Today meal prompt;
- Nutrition Guidance screen;
- AI chat;
- Profile preferences;
- recommendation cards;
- Weekly Plan tasks.

### Nutrition Guidance Screen

Suggested sections:

- What to eat today;
- what to reduce or avoid;
- hydration;
- meal timing;
- shopping ideas;
- restaurant guidance;
- safety constraints;
- ask AI.

Do not present nutrition guidance as medical diet therapy.

## Weekly Plan

### Weekly Plan — Purpose

Convert recommendations into a manageable plan.

### Weekly Plan — Structure

- 7-day overview;
- daily tasks;
- supplement tasks;
- nutrition tasks;
- sleep/recovery tasks;
- activity tasks;
- progress indicator;
- reason for each task;
- adjust plan option.

## Progress Review

### Progress Review — Purpose

Help the product adapt based on real results.

### Progress Review — Recommended Cadence

Every 14 days or after meaningful new data.

### Progress Review — Inputs

- energy;
- mood;
- motivation;
- productivity;
- sleep;
- symptoms;
- adherence;
- free text;
- side effects or problems.

### Progress Review — Output

- what improved;
- what got worse;
- what stayed unchanged;
- what to adjust;
- whether retesting or professional evaluation is appropriate.

## AI Assistant

### AI Assistant — Purpose

Help users understand recommendations and choose next actions.

### AI Can Help With

- explain today's plan;
- explain a biomarker;
- explain supplement timing;
- adapt nutrition within constraints;
- clarify why a recommendation exists;
- help prepare questions for a qualified professional;
- summarize progress.

### AI Must Not

- diagnose;
- claim treatment;
- override clinician instructions;
- recommend restricted substances;
- handle emergencies as a substitute for care;
- invent lab values or user data.

## Profile Screen

### Profile — Purpose

Let the user manage personalization data and account settings.

### Profile — Sections

- personal details;
- goals;
- symptoms;
- lifestyle;
- nutrition preferences and constraints;
- supplement constraints;
- progress history;
- subscription;
- notifications;
- privacy and consent;
- settings.

Do not make delivery address a required profile section unless commerce/delivery is explicitly added.

## Notification Logic

Notifications should be supportive, not stressful.

Examples:

- supplement reminder;
- progress review due;
- daily plan ready;
- analysis processing complete;
- weekly plan update.

Avoid alarmist or medical-urgency language unless explicitly directing the user to qualified care for safety reasons.

## UX Success Criteria

The UX is successful when users can:

1. understand what to do today;
2. understand why each action matters;
3. trust that recommendations are personalized;
4. see when data confidence is limited;
5. follow supplement guidance safely;
6. use nutrition guidance without feeling overwhelmed;
7. ask AI for clarification;
8. update progress;
9. avoid feeling diagnosed or frightened by the app.
