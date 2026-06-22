# USER_FLOW.md

## Project

Health Coach

## Purpose

This document describes the current user flows for Health Coach.

It follows `CURRENT_SOURCE_OF_TRUTH.md` and the target navigation:

```text
Today / Supplements / Body / AI / Profile
```

## Core Flow Principle

The product should move the user from complexity to action.

The main loop is:

```text
collect data -> generate insight -> show Today plan -> user acts -> user reviews progress -> plan adapts
```

## User Access States

### Guest / Preview User

Can:

- view demo or preview experience;
- understand product value;
- see examples of Today, Body, Supplements, AI, and Profile states;
- open subscription or account flow.

Cannot:

- receive personal AI analysis;
- save personal progress;
- upload personal health data unless product rules allow trial capture;
- receive personal supplement plans.

### Registered User With Incomplete Setup

Can:

- fill profile;
- add goals and preferences;
- complete lifestyle and nutrition inputs;
- upload or enter blood analysis;
- complete Braverman assessment.

Sees:

- setup checklist;
- partial-data states;
- clear next steps.

### Active Personalized User

Can:

- use Today;
- follow weekly plan;
- track supplement routine;
- view Body systems and biomarkers;
- ask AI;
- update symptoms, preferences, and progress;
- complete progress reviews.

### Limited / Expired Access User

May view limited history according to product rules.

New AI generation, updated recommendations, and advanced personalization should require active access when subscription enforcement is enabled.

## Main End-to-End Flow

```mermaid
flowchart TD
    A[Open App] --> B[Preview or Login State]
    B --> C[Account / Subscription Flow]
    C --> D[Profile Basics]
    D --> E[Goals and Preferences]
    E --> F[Lifestyle and Symptoms]
    F --> G[Nutrition Preferences]
    G --> H[Blood Analysis Upload or Manual Input]
    G --> I[Braverman Assessment]
    H --> J[AI Health Profile Generation]
    I --> J
    F --> J
    J --> K[AI Summary]
    K --> L[Today]
    L --> M[Daily Plan Execution]
    M --> N[Progress Review]
    N --> O[Updated Recommendations]
    O --> L
```

## First Launch / Preview Flow

Goal: show product value before demanding too much effort.

```mermaid
flowchart TD
    A[Open App] --> B[Splash]
    B --> C[Preview / Demo]
    C --> D[Demo Today]
    C --> E[Demo Body]
    C --> F[Demo Supplements]
    C --> G[Demo AI]
    C --> H[Start Setup or Subscribe]
```

UX rules:

- demo data must be clearly labeled;
- CTA should be visible but not aggressive;
- no personal health claims should be shown before personal data exists.

## Account and Subscription Flow

Business rules may decide whether subscription happens before or after account creation.

The UX must support both implementation orders without changing core product logic.

Recommended abstract flow:

```mermaid
flowchart TD
    A[Start Health Coach] --> B[Account or Subscription Step]
    B --> C{Access Granted?}
    C -->|Yes| D[Profile Setup]
    C -->|No| E[Explain Required Access]
    E --> B
```

Payment provider details must remain backend-owned.

## Profile Setup Flow

Goal: collect only what is needed for personalization.

Inputs:

- name;
- age or date of birth;
- gender if relevant to analysis packages;
- height;
- weight;
- country/city/timezone if useful for reminders and localization;
- primary goals;
- activity level;
- work type;
- sleep schedule;
- symptoms;
- known allergies;
- medication use flag;
- pregnancy/breastfeeding flag when relevant;
- chronic-condition flag when relevant;
- nutrition preferences and restrictions.

Do not require delivery address in standard profile setup.

## Setup Checklist Flow

Goal: help the user complete the minimum data needed for useful personalization.

Checklist items:

- Profile basics;
- Goals and preferences;
- Lifestyle and symptoms;
- Nutrition preferences;
- Blood analysis upload or manual input;
- Braverman assessment;
- AI Health Profile generation.

```mermaid
flowchart TD
    A[Open Setup Checklist] --> B[Profile]
    A --> C[Lifestyle]
    A --> D[Nutrition]
    A --> E[Blood Analysis]
    A --> F[Braverman]
    B --> G[Checklist Progress]
    C --> G
    D --> G
    E --> G
    F --> G
    G --> H{Enough Data?}
    H -->|Yes| I[Generate AI Health Profile]
    H -->|No| J[Show Next Missing Step]
```

## Blood Analysis Flow

Goal: turn lab data into useful, non-diagnostic insights.

Entry points:

- Body;
- setup checklist;
- AI Summary missing-data CTA;
- AI Assistant suggestion;
- Profile data history.

Flow:

```mermaid
flowchart TD
    A[Open Blood Analysis] --> B[Choose Upload or Manual Input]
    B --> C[Select Package or Custom]
    C --> D[Add File or Biomarkers]
    D --> E[Processing / Review]
    E --> F{Extraction Successful?}
    F -->|Yes| G[Biomarker Results]
    F -->|Needs Review| H[Manual Correction]
    F -->|No| I[Retry or Manual Input]
    G --> J[Body Systems Updated]
```

UX rules:

- show file status clearly;
- allow manual correction;
- do not diagnose;
- show confidence and missing markers;
- recommend professional evaluation for potentially serious findings.

## Braverman Assessment Flow

Goal: personalize coaching tone, motivation style, and recommendation framing.

Flow:

```mermaid
flowchart TD
    A[Open Braverman] --> B[Read Safety Note]
    B --> C[Answer Questions]
    C --> D[Calculate Result]
    D --> E[Show Archetype and Profiles]
    E --> F[Apply To AI Health Profile]
```

Output:

- dominant profile;
- secondary profile when relevant;
- attention areas;
- motivation archetype;
- coaching style;
- recommendation personalization notes.

The result must not be presented as a neurotransmitter diagnosis.

## Lifestyle and Symptoms Flow

Goal: capture subjective context that lab data may not explain.

Inputs:

- sleep quality and schedule;
- stress level;
- activity level;
- work type;
- fatigue;
- brain fog;
- anxiety/stress;
- mood;
- motivation;
- concentration;
- digestive discomfort;
- recovery;
- free text.

Flow:

```mermaid
flowchart TD
    A[Open Lifestyle Questions] --> B[Answer Structured Questions]
    B --> C[Add Free Text]
    C --> D[Save]
    D --> E[Update Profile Confidence]
```

## Nutrition Preferences Flow

Goal: capture food habits, preferences, restrictions, and safety constraints.

Inputs:

- typical day of eating;
- meal timing;
- sugar and processed food intake;
- water intake;
- caffeine and alcohol context if collected;
- allergies;
- intolerances;
- dietary preferences;
- budget or cooking constraints;
- eating-disorder risk flag when appropriate;
- diabetes or high-risk metabolic constraints when appropriate.

Flow:

```mermaid
flowchart TD
    A[Open Nutrition Preferences] --> B[Describe Typical Day]
    B --> C[Add Restrictions]
    C --> D[Add Goals]
    D --> E[Save]
    E --> F[Use In Today and AI]
```

Nutrition guidance must not be framed as medical diet therapy.

## AI Health Profile Generation Flow

Goal: combine available data into an actionable, safety-aware profile.

Inputs:

- profile;
- goals;
- symptoms;
- lifestyle;
- nutrition;
- biomarkers;
- Braverman;
- supplement context;
- progress history.

Flow:

```mermaid
flowchart TD
    A[Enough Data Available] --> B[Build Context]
    B --> C[Backend AI Function]
    C --> D[Validate Output]
    D --> E{Valid?}
    E -->|Yes| F[Store AI Health Profile]
    E -->|No| G[Safe Error / Retry]
    F --> H[AI Summary]
```

AI output must be validated before rendering.

## AI Summary Flow

Goal: explain the first or updated profile clearly.

Sections:

- current limiting factors;
- highest-impact actions;
- expected effects;
- confidence;
- missing data;
- next best action;
- safety note.

Flow:

```mermaid
flowchart TD
    A[Profile Generated] --> B[Show AI Summary]
    B --> C[Review Limiting Factors]
    C --> D[Review Next Actions]
    D --> E[Go To Today]
    D --> F[Ask AI]
```

## Today Flow

Goal: give the user a useful plan every day.

Flow:

```mermaid
flowchart TD
    A[Open Today] --> B[View State and Scores]
    B --> C[View Top Priorities]
    C --> D[Complete Daily Tasks]
    D --> E[Track Supplement / Nutrition / Recovery]
    E --> F[Ask AI if Needed]
    F --> G[Update Progress]
```

Today should show useful guidance even with partial data, while clearly showing confidence limitations.

## Goal Handling Flow

Goal is not a main tab.

Goals appear inside Today, Weekly Plan, AI, and Profile.

Flow:

```mermaid
flowchart TD
    A[User Goal Exists] --> B[Today Shows Goal Progress]
    B --> C[Weekly Plan Uses Goal]
    C --> D[Progress Review Updates Goal]
    D --> E[AI Explains Goal Strategy]
    E --> F[Profile Can Edit Goal]
```

## Body Flow

Goal: help the user understand body systems and biomarkers.

Flow:

```mermaid
flowchart TD
    A[Open Body] --> B[View System Cards]
    B --> C[Open System Detail]
    C --> D[View Related Biomarkers]
    D --> E[Open Biomarker Detail]
    B --> F[Open Analyses]
    B --> G[Open Braverman]
    B --> H[Open AI Health Profile]
```

## Supplements Flow

Goal: help the user follow a safe routine.

Flow:

```mermaid
flowchart TD
    A[Open Supplements] --> B[View My Supplements]
    B --> C[View Schedule]
    B --> D[Open Supplement Detail]
    A --> E[Open Catalog]
    A --> F[Open Bee Products]
    C --> G[Log Intake]
    D --> H[Read Safety Notes]
```

Safety note should be visible before users act on a supplement protocol.

## Bee Products Flow

Bee products are supportive wellness products, not medical treatments.

Flow:

```mermaid
flowchart TD
    A[Open Bee Products] --> B[View Relevant Products]
    B --> C[Open Product Detail]
    C --> D[Read Benefits and Safety]
    D --> E[Add To Recommendation Context]
```

Always consider allergy risk.

## Nutrition Guidance Flow

Goal: help the user choose realistic food actions.

Entry points:

- Today;
- AI;
- Profile preferences;
- Weekly Plan task;
- recommendation detail.

Flow:

```mermaid
flowchart TD
    A[Open Nutrition Guidance] --> B[View Today's Food Focus]
    B --> C[View Meal Suggestions]
    C --> D[Adjust For Preferences]
    D --> E[Ask AI]
    E --> F[Save Useful Guidance]
```

## AI Assistant Flow

Goal: answer user questions with context and safety.

Flow:

```mermaid
flowchart TD
    A[Open AI] --> B[Ask Question]
    B --> C[Build Safe Context]
    C --> D[Backend AI Function]
    D --> E[Validate Response]
    E --> F[Show Answer]
    F --> G[Link To Relevant Screen]
```

AI must not invent user data. If information is missing, it should say so and suggest the next data step.

## Weekly Plan Flow

Goal: convert recommendations into manageable actions.

Flow:

```mermaid
flowchart TD
    A[Open Weekly Plan] --> B[View 7 Days]
    B --> C[Open Day]
    C --> D[Complete Tasks]
    D --> E[Update Progress]
    E --> F[Adjust Future Tasks]
```

Task categories:

- sleep;
- nutrition;
- supplements;
- activity;
- recovery;
- stress management;
- retesting;
- professional evaluation when appropriate.

## Progress Review Flow

Goal: adapt guidance based on real outcomes.

Trigger examples:

- every 14 days;
- after new blood analysis;
- after low adherence;
- after side effects;
- after major symptom change.

Flow:

```mermaid
flowchart TD
    A[Review Due] --> B[Ask Progress Questions]
    B --> C[Collect Scores and Notes]
    C --> D[AI Adjustment]
    D --> E[Updated Plan]
    E --> F[Today]
```

## Profile Flow

Goal: let users control personalization data.

Flow:

```mermaid
flowchart TD
    A[Open Profile] --> B[Personal Data]
    A --> C[Goals]
    A --> D[Symptoms and Lifestyle]
    A --> E[Nutrition Preferences]
    A --> F[Subscription]
    A --> G[Settings]
    A --> H[Privacy and Consent]
```

Do not require delivery information unless commerce/delivery is explicitly added.

## Error and Edge Case Flows

### Failed Upload

Show:

- upload failed;
- accepted formats;
- retry;
- manual input.

### AI Error

Show:

- AI could not generate result;
- no diagnosis or unsafe fallback;
- retry;
- support or manual next step.

### Incomplete Data

Show:

- what is missing;
- what can still be used;
- how confidence is affected;
- next best step.

### High-Risk Input

Show safety-aware guidance and recommend qualified professional evaluation when appropriate.

### Subscription / Access Error

Show:

- what access is limited;
- what remains visible;
- how to restore access.

## Product Success Flow

A successful user journey looks like this:

```text
Open app -> understand current state -> complete one useful action today -> track progress -> receive adjusted guidance -> continue safely
```
