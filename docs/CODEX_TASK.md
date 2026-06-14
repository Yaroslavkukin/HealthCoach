# CODEX_TASK.md

## Project

Health Coach

## Purpose of This Document

This file is the main execution brief for Codex.

Codex must read all documentation files in the `/docs` folder and build the MVP according to the product, UX, AI, database, and safety specifications.

This document defines:

- implementation scope;
- recommended tech stack;
- development order;
- non-negotiable product rules;
- MVP exclusions;
- expected deliverables.

---

# 1. Required Documentation Files

Before writing code, read the following files:

```text
/docs/PRODUCT_VISION.md
/docs/MVP.md
/docs/ANALYSIS_SYSTEM.md
/docs/AI_RECOMMENDATION_ENGINE.md
/docs/SUPPLEMENTS_ENGINE.md
/docs/BEE_PRODUCTS_ENGINE.md
/docs/BRAVERMAN_ENGINE.md
/docs/MONETIZATION.md
/docs/UX_ARCHITECTURE.md
/docs/USER_FLOW.md
/docs/DATABASE_SCHEMA.md
/docs/HEALTH_SCORE_ENGINE.md
/docs/NUTRITION_ENGINE.md
/docs/CODEX_TASK.md
```

If documentation conflicts, use this priority order:

1. `CODEX_TASK.md`
2. `MVP.md`
3. `UX_ARCHITECTURE.md`
4. `DATABASE_SCHEMA.md`
5. Engine documents
6. Product vision documents

---

# 2. Product Summary

Health Coach is a mobile AI health optimization application.

It helps users improve:

- energy;
- emotional state;
- motivation;
- productivity;
- sleep;
- recovery;
- general well-being.

The app uses:

- blood analysis results;
- Braverman assessment;
- lifestyle questionnaire;
- nutrition description;
- symptoms;
- 14-day progress reviews;
- AI-generated recommendations.

Core product principle:

> Less interpretation. More clarity. More action.

Main UX principle:

> Today first.

The user should open the app and immediately understand what to do today.

---

# 3. Target Platform

Build a mobile application for:

- iOS
- Android

Recommended stack:

```text
Frontend: React Native + Expo + TypeScript
Backend: Supabase
Database: PostgreSQL via Supabase
Authentication: Supabase Auth
Storage: Supabase Storage
AI: DeepSeek V4 Pro through backend/server functions
Payments: payment provider abstraction for MVP
Styling: React Native styling system or NativeWind/Tailwind-compatible approach
```

Do not hardcode secrets in the frontend.

All API keys must be loaded from environment variables.

---

# 4. MVP Scope

## Must Build

The MVP must include:

1. Splash screen
2. Preview Mode
3. Subscription screen
4. Account creation after subscription
5. Personal profile setup
6. Delivery information setup
7. Start checklist
8. Blood analysis upload
9. Braverman assessment
10. Lifestyle questionnaire
11. Nutrition questionnaire
12. AI processing screen
13. AI Summary screen
14. Today screen
15. Goal screen
16. My Body screen
17. Biomarker detail screen
18. Supplements screen
19. Bee Product Optimization section
20. Nutrition screen
21. AI Assistant screen
22. Weekly Plan screen
23. Profile screen
24. 14-day review flow
25. Subscription expired state

---

# 5. MVP Exclusions

Do not implement the following as full production features in MVP:

- automatic clinic booking;
- real laboratory API integrations;
- real marketplace checkout;
- automatic supplement delivery;
- wearable synchronization;
- doctor dashboard;
- full medical record system;
- community features;
- complex analytics dashboards;
- real-time chat with doctors.

Clinic and marketplace screens may exist as placeholders or future-ready modules.

---

# 6. Access Model

The app must not force registration immediately after first launch.

User flow:

```text
Open app
↓
Splash screen
↓
Preview Mode
↓
Subscription purchase
↓
Account creation
↓
Profile setup
↓
Initial assessment
↓
AI Health Profile generation
↓
Active Health Coach mode
```

## Preview Mode

In Preview Mode, user can explore demo interface data.

Preview Mode must include:

- demo Today screen;
- demo Health Score;
- demo Motivation Archetype;
- demo supplement stack;
- demo nutrition recommendations;
- demo success stories;
- subscription CTA.

Preview Mode must not store personal health data.

---

# 7. Subscription Logic

Subscription options:

## Monthly

Price:

```text
3000 RUB / month
```

## Semi-Annual

Price:

```text
15000 RUB / 6 months
```

Positioning:

The user is not paying for access to an app.

The user is paying for access to a personal AI Health Coach and recommendation system.

## MVP Implementation Option

If real payment provider integration is not ready, implement:

- subscription screen UI;
- subscription plan selection;
- mocked payment success flow for development;
- subscription status in database;
- architecture prepared for real payment provider integration.

Do not block core development on payment integration.

---

# 8. Authentication

Registration happens only after subscription purchase.

Required authentication:

- email;
- password.

Future-ready options:

- Apple Login;
- Google Login.

Use Supabase Auth.

---

# 9. User Profile Requirements

After subscription and account creation, the user must complete profile setup.

## Required Fields

Personal data:

- first name;
- last name;
- age;
- gender;
- height;
- weight.

Location:

- country;
- city;
- address;
- postal code.

Delivery information:

- preferred delivery method;
- CDEK pickup point;
- Russian Post office;
- delivery comments.

Health context:

- main goal;
- work type;
- activity level;
- sleep schedule;
- stress level;
- current symptoms.

The user enters information once.

Other app modules must reuse profile data automatically.

---

# 10. Start Checklist

After profile setup, show Start Checklist.

Checklist items:

1. Blood Analysis
2. Braverman Assessment
3. Lifestyle Description
4. Nutrition Description
5. AI Health Profile

AI Health Profile is locked until required inputs are completed.

Each checklist item must have status:

- not started;
- in progress;
- completed;
- processing;
- locked.

---

# 11. Blood Analysis Upload

Supported upload formats:

- PDF;
- image;
- manual input.

The MVP should allow upload and storage of files.

OCR/extraction can be implemented as:

- real AI extraction if available;
- manual entry fallback;
- mock parser for development.

## Blood Analysis Packages

Male:

- Foundation;
- Advanced;
- Complete.

Female:

- Foundation;
- Complete.

## Preparation Guide

The app must include blood test preparation guidance:

- avoid intense training the day before;
- avoid emotional overload;
- avoid overeating;
- sleep well before testing;
- test at the same time of day when tracking progress.

---

# 12. Braverman Assessment

Build a questionnaire system for the Braverman Assessment.

The engine must identify:

- dominant neurotransmitter profile;
- possible neurotransmitter deficiencies;
- Motivation Archetype.

Possible Motivation Archetypes:

- The Strategist;
- The Creator;
- The Guardian;
- The Explorer.

User should not see raw technical scores as the main output.

User should see:

- archetype name;
- strengths;
- challenges;
- motivation drivers;
- best coaching style.

---

# 13. AI Health Profile

After all required onboarding steps are completed, AI generates Health Profile.

The AI Health Profile must include:

- Overall Health Score;
- Energy Score;
- Mood Score;
- Motivation Score;
- Productivity Score;
- Biological System Scores;
- Motivation Archetype;
- limiting factors;
- recommendations;
- 7-day action plan.

Biological System Scores:

- Hormonal System;
- Thyroid System;
- Metabolic System;
- Nutritional System;
- Stress & Recovery System;
- Inflammation System;
- Sleep System;
- Digestive System.

Use `HEALTH_SCORE_ENGINE.md` for scoring logic.

---

# 14. AI Summary Screen

AI Summary is one of the most important screens.

It must answer:

> Why do I feel this way right now?

Required sections:

1. Current Limiting Factors
2. What Will Create the Biggest Result
3. Expected Effect
4. Recommended Next Step
5. Safety Note

Example:

```text
Current limiting factors:
1. Elevated cortisol
2. Insufficient recovery
3. Low vitamin D

What will create the biggest result:
1. Sleep stabilization
2. Magnesium protocol
3. Perga support
```

---

# 15. Today Screen

Today is the main daily screen.

It answers:

> What should I do today?

Required elements:

- greeting;
- Overall Health Score;
- Energy Score;
- Motivation Score;
- Mood Score;
- daily checklist;
- supplement reminders;
- bee product reminders;
- walking/activity task;
- hydration task;
- sleep target;
- AI insight;
- link to Weekly Plan;
- link to AI Assistant.

Each daily task must have:

- title;
- category;
- time;
- completion checkbox;
- optional explanation.

---

# 16. Goal Screen

Goal screen shows long-term progress.

Required features:

- selected goal;
- goal duration;
- progress percentage;
- milestone timeline;
- related recommendations;
- button to ask AI about the goal.

Example goals:

- Increase energy;
- Improve emotional state;
- Improve motivation;
- Improve productivity;
- Improve sleep;
- Improve recovery;
- Improve testosterone;
- Reduce fatigue.

---

# 17. My Body Screen

My Body screen visualizes biological systems.

Required systems:

- Hormonal System;
- Energy System;
- Nutritional System;
- Stress & Recovery System;
- Digestive System;
- Sleep System.

Each system card shows:

- name;
- score or status;
- trend;
- color state;
- CTA to details.

Use human body visualization if feasible.

---

# 18. Biomarker Detail Screen

For each biomarker, display:

- biomarker name;
- value;
- unit;
- reference range;
- status;
- trend chart;
- simple explanation;
- why it matters;
- what affects it;
- how to improve it;
- related recommendations;
- Ask AI button.

Do not present biomarker interpretation as medical diagnosis.

---

# 19. Supplements Screen

The Supplements screen must show two stack modes.

## Essential Stack

Only necessary supplements.

These are supplements without which meaningful improvement is unlikely or significantly harder.

## Complete Stack

Full optimization stack.

Includes Essential Stack plus supportive supplements.

Each supplement card shows:

- name;
- dosage field;
- next intake time;
- today status;
- reason;
- confidence level;
- schedule;
- food instructions;
- compatibility notes;
- safety note.

The AI must automatically generate:

- time of day;
- before food / with food / after food;
- compatible combinations;
- separation rules;
- course duration.

---

# 20. Supplement Safety Rules

Important MVP safety rule:

The MVP should only actively recommend legal wellness supplements and general nutritional support.

The app must not recommend prescription drugs, controlled substances, injectable substances, experimental compounds, SARMs, peptides, or other regulated medical products as ordinary supplements.

Restricted or medical substances may only be stored as disabled/future/clinician-only catalog entries if needed.

They must not appear in user-facing automatic recommendation stacks in MVP.

Every supplement recommendation must include:

```text
Before starting any supplement protocol, consult a qualified healthcare professional, especially if you have medical conditions, take medication, are pregnant, breastfeeding, or have allergies.
```

---

# 21. Bee Product Optimization

Bee products are supportive natural optimization tools.

They do not replace:

- sleep;
- nutrition;
- physical activity;
- stress management;
- essential supplements.

Products:

- Perga;
- Royal Jelly;
- Bee Pollen;
- Honey;
- Zabrus.

Default priority:

1. Perga
2. Royal Jelly
3. Bee Pollen
4. Honey
5. Zabrus

Each card must include:

- product name;
- reason;
- how to use;
- expected benefit;
- allergy warning.

Safety warning:

Bee products may cause allergic reactions.

Users with allergies should avoid them.

---

# 22. Nutrition Screen

Nutrition screen must use `NUTRITION_ENGINE.md`.

Required features:

- daily meal suggestions;
- nutrition principles;
- AI nutrition chat;
- meal modification;
- water recommendation;
- restaurant/fast food help mode.

Nutrition principles:

- prefer natural foods;
- prefer minimally processed foods;
- avoid refined sugar;
- support nutrient density;
- include bee products where appropriate;
- adjust to user profile and goals.

The app must avoid unsafe raw food advice.

“Minimal processing” must be interpreted safely.

---

# 23. AI Assistant

AI Assistant must have access to:

- user profile;
- blood analysis;
- biomarkers;
- Braverman results;
- Motivation Archetype;
- supplement stack;
- bee product plan;
- nutrition plan;
- weekly plan;
- progress reviews;
- current symptoms.

AI Assistant can:

- explain biomarkers;
- explain recommendations;
- answer supplement questions;
- adjust meal plan;
- help with food choices;
- explain symptoms;
- update weekly plan;
- summarize progress.

AI Assistant must not:

- diagnose disease;
- replace doctors;
- prescribe medication;
- recommend restricted substances;
- provide emergency medical advice as a substitute for care.

---

# 24. Weekly Plan

Weekly Plan must show a 7-day action plan.

For each day, show tasks by category:

- supplements;
- bee products;
- nutrition;
- walking;
- training;
- sleep;
- water;
- recovery practice.

Each task has:

- title;
- short instruction;
- time;
- checkbox;
- status.

Weekly Plan should be generated after AI Health Profile.

---

# 25. 14-Day Review

Every 14 days, AI initiates progress review.

Questions:

- How is your energy?
- How is your mood?
- How is your motivation?
- How is your productivity?
- How is your sleep?
- Did anything improve?
- Did anything get worse?
- Did you follow the plan?

After review, AI updates:

- scores;
- Today tasks;
- Weekly Plan;
- supplement recommendations;
- nutrition plan;
- goal progress;
- AI Summary.

---

# 26. Database

Use `DATABASE_SCHEMA.md` as the source of truth.

Implement tables for:

- users;
- profiles;
- delivery information;
- subscriptions;
- payments;
- blood tests;
- biomarkers;
- Braverman results;
- lifestyle questionnaires;
- nutrition questionnaires;
- AI health profiles;
- health scores;
- AI summaries;
- supplement recommendations;
- bee product recommendations;
- weekly plans;
- daily tasks;
- reviews;
- AI chat messages;
- notifications.

Use Supabase Row Level Security.

Users must only access their own data.

---

# 27. Storage

Use Supabase Storage buckets:

```text
blood-test-files
profile-images
app-assets
```

Blood test files must be private.

Profile images must be user-specific.

App assets may be public.

---

# 28. AI Architecture

AI calls should go through backend/server functions, not directly from frontend.

Recommended AI modules:

- Blood Analysis Parser
- AI Recommendation Engine
- Health Score Engine
- Supplements Engine
- Bee Products Engine
- Braverman Engine
- Nutrition Engine
- Task Engine
- Review Engine
- AI Assistant

Each AI output should be stored in structured JSON where possible.

AI responses should include:

- explanation;
- recommendation;
- confidence;
- safety note;
- next action.

---

# 29. Recommended Project Structure

```text
HealthCoach/
│
├── docs/
│   ├── PRODUCT_VISION.md
│   ├── MVP.md
│   ├── ANALYSIS_SYSTEM.md
│   ├── AI_RECOMMENDATION_ENGINE.md
│   ├── SUPPLEMENTS_ENGINE.md
│   ├── BEE_PRODUCTS_ENGINE.md
│   ├── BRAVERMAN_ENGINE.md
│   ├── MONETIZATION.md
│   ├── UX_ARCHITECTURE.md
│   ├── USER_FLOW.md
│   ├── DATABASE_SCHEMA.md
│   ├── HEALTH_SCORE_ENGINE.md
│   ├── NUTRITION_ENGINE.md
│   └── CODEX_TASK.md
│
├── app/
│   ├── screens/
│   ├── components/
│   ├── navigation/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env.example
├── README.md
└── package.json
```

---

# 30. Environment Variables

Create `.env.example` with placeholders:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=
DEEPSEEK_MODEL=deepseek-v4-pro
PAYMENT_PROVIDER_SECRET_KEY=
PAYMENT_PROVIDER_PUBLIC_KEY=
APP_ENV=development
```

Do not commit real secrets.

---

# 31. Implementation Phases

## Phase 1 — Foundation

- initialize Expo React Native project;
- set up TypeScript;
- set up navigation;
- set up Supabase client;
- create basic design system;
- create screen placeholders.

## Phase 2 — Auth and Subscription Flow

- Preview Mode;
- Subscription screen;
- mock payment success;
- account creation;
- subscription status logic.

## Phase 3 — Profile and Onboarding

- profile setup;
- delivery data;
- Start Checklist;
- lifestyle questionnaire;
- nutrition questionnaire.

## Phase 4 — Blood Analysis and Braverman

- upload blood test file;
- manual biomarker input;
- Braverman questionnaire;
- result storage.

## Phase 5 — AI Health Profile

- AI processing screen;
- generate mock or real AI Health Profile;
- store scores and summaries;
- show AI Summary.

## Phase 6 — Daily Experience

- Today screen;
- Weekly Plan;
- Daily tasks;
- completion tracking;
- notifications placeholder.

## Phase 7 — Recommendations

- Supplements screen;
- Bee products section;
- Nutrition screen;
- AI Assistant.

## Phase 8 — Review and Polish

- 14-day review flow;
- Profile screen;
- expired subscription state;
- error states;
- loading states;
- final UI polish.

---

# 32. UI Requirements

Use the design direction from `UX_ARCHITECTURE.md`.

General UI rules:

- dark premium background;
- green accent color;
- orange warning color;
- card-based screens;
- rounded components;
- bottom navigation;
- clear CTA buttons;
- readable text;
- minimal clutter;
- action-first layouts.

---

# 33. Error Handling

Handle:

- failed login;
- expired subscription;
- failed file upload;
- unsupported file type;
- AI processing failure;
- incomplete questionnaire;
- missing biomarkers;
- network errors;
- empty states.

Every error should explain:

- what happened;
- what the user can do next.

---

# 34. Security and Privacy

Health data is sensitive.

Requirements:

- use Row Level Security;
- store user health data privately;
- keep blood test uploads private;
- never expose service keys to frontend;
- restrict AI calls to backend/server functions;
- avoid logging sensitive user data unnecessarily;
- allow users to delete account data in future version.

---

# 35. Medical and Legal Safety

The app must include clear disclaimer language.

Health Coach:

- does not diagnose diseases;
- does not replace licensed medical professionals;
- provides educational and informational recommendations;
- encourages consultation with qualified healthcare professionals;
- does not recommend prescription medication or restricted compounds in MVP.

For potentially serious findings, AI should recommend professional medical evaluation.

---

# 36. Expected Deliverables

Codex should produce:

1. Working Expo React Native app
2. TypeScript project structure
3. Supabase schema migrations
4. Supabase storage bucket configuration notes
5. Mock seed data
6. AI service abstraction
7. Payment abstraction or mock payment flow
8. Complete navigation
9. MVP screens
10. README.md
11. `.env.example`
12. Basic tests or validation utilities where practical

---

# 37. Definition of Done

The MVP is considered complete when:

1. User can open the app without registration.
2. User can explore Preview Mode.
3. User can choose subscription plan.
4. User can create account after subscription.
5. User can complete profile.
6. User can complete Start Checklist.
7. User can upload blood analysis or enter biomarkers manually.
8. User can complete Braverman Assessment.
9. User can generate AI Health Profile.
10. User can see AI Summary.
11. User can use Today screen.
12. User can view supplement plan.
13. User can view bee product recommendations.
14. User can view nutrition recommendations.
15. User can use AI Assistant.
16. User can complete daily tasks.
17. User can complete 14-day review.
18. User data is isolated and protected.
19. App does not present recommendations as medical diagnosis.

---

# 38. Final Instruction to Codex

Build the simplest working version first.

Do not over-engineer.

Prioritize:

1. User flow
2. Clear UI
3. Correct data structure
4. AI-ready architecture
5. Safety layer
6. Future extensibility

The MVP should feel complete to the user, even if some backend integrations are mocked.

Main product rule:

> The user should always know what to do next.
