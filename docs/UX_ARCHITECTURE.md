# UX_ARCHITECTURE.md

## Project

Health Coach

## Document Purpose

This document describes the UX architecture, screen structure, user flows, navigation logic, and interface states for the Health Coach mobile application MVP.

The document is intended for:

- Product development
- UI/UX design
- Codex implementation
- Frontend architecture
- Future feature planning

---

# 1. Core UX Philosophy

Health Coach is not a laboratory report application.

Health Coach is a personal AI health coach that helps the user understand what to do today to improve:

- Energy
- Emotional state
- Motivation
- Productivity
- Recovery
- General well-being

The interface should not focus on raw medical complexity.

The interface should focus on clear action.

Main UX principle:

> Today first.

The user should open the app and immediately understand:

1. How am I doing?
2. What is limiting me?
3. What should I do today?
4. What is my next step?

---

# 2. Visual Direction

The visual style should feel:

- Premium
- Calm
- Scientific
- Natural
- Personal
- High-performance

## Recommended UI Style

- Dark green / black background
- Neon green accents
- Orange warning accents
- Soft card-based layout
- Rounded corners
- Minimal visual noise
- High contrast for important actions
- Human-body visualization for biological systems
- Progress bars and circular health indicators
- Bottom navigation with clear active states

## Emotional Impression

The app should feel like a mix of:

- AI health coach
- Biohacking dashboard
- Personal performance system
- Wellness companion

---

# 3. Main Navigation

The MVP should use a fixed bottom navigation bar.

## Bottom Navigation Items

1. Today
2. Goal
3. Body
4. AI
5. Profile

## Secondary Sections

The following sections are accessed from cards, buttons, or internal tabs:

- Supplements
- Nutrition
- Weekly Plan
- Biomarker Details
- AI Summary
- Success Stories
- Clinic
- Settings

---

# 4. User Access Model

Health Coach should not force registration at first launch.

The user should be able to explore the application before purchasing.

## Access Stages

### Stage 1 — Guest / Preview Mode

User can:

- View demo interface
- Explore example dashboards
- Read example AI insights
- View example success stories
- Understand the value of the app

User cannot:

- Receive personal AI analysis
- Upload personal blood tests
- Save progress
- Use personal recommendations

### Stage 2 — Subscription Purchase

User purchases access.

Available pricing:

- 3,000 RUB per month
- 15,000 RUB per 6 months

### Stage 3 — Account Creation

Registration happens only after subscription purchase.

### Stage 4 — Personal Data Entry

User fills in personal profile and delivery information.

### Stage 5 — Initial Assessment

User completes:

- Blood analysis upload
- Braverman assessment
- Lifestyle questionnaire
- Nutrition description

### Stage 6 — Active Health Coach Mode

The app becomes fully personalized.

---

# 5. Global Screen States

Every major screen should support multiple states.

## 5.1 Preview State

Used before subscription.

Displays demo data.

CTA:

- Start Your Health Journey
- Unlock Full Access

## 5.2 Empty State

Used after subscription but before user data is added.

Example:

> Your personalized recommendations will appear here after you complete your initial assessment.

CTA:

- Complete Setup

## 5.3 Partial Data State

Used when the user completed only part of onboarding.

Example:

- Braverman completed
- Blood analysis missing

The AI may provide limited recommendations but should clearly indicate that the analysis is incomplete.

## 5.4 Processing State

Used when AI is generating results.

Example:

> Building your Health Profile...

## 5.5 Active State

Used when all required information is available.

Displays full personalized data.

## 5.6 Subscription Expired State

User can view limited historical data but cannot generate new AI recommendations.

CTA:

- Renew Subscription

---

# 6. Screen 0 — Splash Screen

## Purpose

Create a premium first impression.

## Duration

2–3 seconds.

## Content

- Health Coach logo
- Dark green background
- Minimal animation

## Transition

After splash:

- First-time user → Preview Mode
- Existing logged-in user → Today Screen
- Expired subscription → Subscription Renewal Screen

---

# 7. Screen 1 — Preview Mode

## Purpose

Allow the user to explore Health Coach before payment.

## Content

A demo version of the app with sample data.

Example demo user:

- Health Score: 82/100
- Energy: 78/100
- Motivation: 74/100
- Mood: 81/100
- Archetype: The Strategist
- Example supplement stack
- Example nutrition plan
- Example AI summary

## CTA

Primary:

- Start Your Health Journey

Secondary:

- View Subscription

## Restrictions

Preview Mode must clearly indicate that data is fictional.

---

# 8. Screen 2 — Subscription Screen

## Purpose

Convert preview users into paying users.

## Positioning

The user is not paying for access to an app.

The user is paying for access to a personal AI health coach and a structured recommendation system.

## Headline

Health Coach

Your personal AI health coach based on blood analysis, nutrition, lifestyle, and progress.

## Benefits

- Personalized AI recommendations
- Blood analysis interpretation
- Braverman assessment analysis
- Supplement plans
- Bee product optimization
- Nutrition plans
- AI assistant
- Progress tracking
- 14-day health reviews

## Pricing

Monthly:

3,000 RUB / month

Semi-Annual:

15,000 RUB / 6 months

## CTA

- Subscribe for 3,000 RUB / month
- Subscribe for 15,000 RUB / 6 months

---

# 9. Screen 3 — Account Creation

## Trigger

Shown only after subscription purchase.

## Required Fields

- Email
- Password

## Optional Future Login Options

- Apple ID
- Google

## Purpose

Save personal data, recommendations, and progress history.

---

# 10. Screen 4 — Personal Profile

## Purpose

Collect all user information required for personalization and future product delivery.

## Required Personal Data

- First name
- Last name
- Age
- Gender
- Height
- Weight

## Location Data

- Country
- City
- Address
- Postal code

## Delivery Data

- Preferred delivery method
- CDEK pickup point
- Russian Post office
- Delivery comments

## Health Context

- Main goal
- Work type
- Activity level
- Sleep schedule
- Stress level
- Current symptoms

## UX Principle

The user enters information once.

AI and other app sections reuse this data automatically.

---

# 11. Screen 5 — Start Checklist

## Purpose

Give the user a clear step-by-step instruction for how to start using Health Coach.

## Checklist Items

### Step 1 — Blood Analysis

User selects recommended blood analysis package.

Possible packages:

Male:

- Foundation
- Advanced
- Complete

Female:

- Foundation
- Complete

Status:

- Not started
- Uploaded
- Processing
- Completed

### Step 2 — Braverman Assessment

User completes the test.

Status:

- Not started
- In progress
- Completed

### Step 3 — Lifestyle Description

User describes:

- Typical day
- Sleep habits
- Work schedule
- Physical activity
- Stress level

Status:

- Not started
- Completed

### Step 4 — Nutrition Description

User describes:

- What they usually eat
- Meal timing
- Sugar consumption
- Processed food consumption
- Water intake

Status:

- Not started
- Completed

### Step 5 — AI Health Profile

Locked until required inputs are completed.

CTA:

- Generate My Health Profile

---

# 12. Screen 6 — Blood Analysis Upload

## Purpose

Allow the user to upload blood test results.

## Supported Formats

- PDF
- Image
- Manual input

## Features

- Upload file
- Take photo
- Enter biomarkers manually
- Select analysis package
- See missing markers

## Preparation Guide

Before uploading or ordering tests, the app should display blood test preparation rules:

- Avoid intense training the day before
- Avoid emotional overload
- Avoid overeating
- Sleep well before testing
- Test at the same time of day when tracking progress

---

# 13. Screen 7 — Braverman Assessment

## Purpose

Identify neurotransmitter profile and motivation archetype.

## Output

The app calculates:

- Dominant neurotransmitter profile
- Possible neurotransmitter deficiencies
- Motivation Archetype

Possible archetypes:

- The Strategist
- The Creator
- The Guardian
- The Explorer

## UX Principle

The user should not see raw technical scoring as the main result.

They should see a clear identity-based explanation.

Example:

> Your Motivation Archetype: The Strategist
>
> You are driven by progress, achievement, and clear goals.

---

# 14. Screen 8 — AI Processing

## Purpose

Show that AI is building the user’s personalized profile.

## Content

Processing steps:

- Reading blood analysis
- Evaluating biomarkers
- Evaluating Braverman profile
- Reviewing symptoms
- Building recommendations
- Creating 7-day plan

## Completion

After processing, the user is taken to AI Summary.

---

# 15. Screen 9 — AI Summary

## Purpose

This is one of the most important screens in the application.

It explains the meaning behind the user’s results.

## Main Question

Why do I feel this way right now?

## Sections

### 1. Current Limiting Factors

Example:

1. Elevated cortisol
2. Insufficient recovery
3. Low vitamin D

### 2. What Will Create the Biggest Result

Example:

1. Sleep stabilization
2. Magnesium protocol
3. Perga support

### 3. Expected Effect

Example:

Over the next 4–8 weeks, you may notice:

- More energy
- Better sleep
- Better recovery
- Improved mood and motivation

### 4. Recommended Next Step

CTA:

- View Today’s Plan
- View Supplement Stack
- Ask AI

## Safety Note

The AI should remind users that recommendations are informational and do not replace consultation with a qualified healthcare professional.

---

# 16. Screen 10 — Today

## Purpose

Main daily screen.

This screen answers:

> What should I do today?

## Content

### Greeting

Example:

> Good morning, Yaroslav.

### Health Score

Example:

82 / 100

Status:

Good condition

### Core Scores

- Energy
- Motivation
- Mood

Example:

Energy: 78/100
Motivation: 74/100
Mood: 81/100

### Today’s Tasks

Examples:

- Take Omega-3
- Take Magnesium
- Walk 30 minutes
- Drink 2 liters of water
- Sleep before 23:00

Each task has:

- Checkbox
- Category icon
- Progress state

### Progress Bar

Example:

Completed: 2 of 4

### AI Insight

Short explanation:

> Today, your main focus is recovery. Magnesium and walking may help reduce stress and improve energy.

### CTA

- Learn More
- Ask AI
- Open Weekly Plan

---

# 17. Screen 11 — Goal Journey

## Purpose

Show the user’s long-term goal and progress.

## Example Goal

Increase Testosterone

Goal duration:

90 days

## Sections

### Goal Card

- Goal name
- Goal duration
- Edit button

### Milestone Timeline

Example:

1. Blood analysis — Completed
2. Supplement stack — Completed
3. Plan execution — In progress
4. Control blood analysis — Pending

### Progress

Example:

56%

### CTA

- View Plan
- Update Goal
- Ask AI about Goal

---

# 18. Screen 12 — My Body

## Purpose

Visualize user health systems in a simple way.

The user should understand systems rather than isolated biomarkers.

## Displayed Systems

- Hormonal System
- Energy System
- Nutritional System
- Stress & Recovery System
- Digestive System
- Sleep System

## Each System Shows

- Status
- Icon
- Color
- Score or label

Status examples:

- Good
- Attention
- Poor

## Main Visual

Human body visualization in the center.

## CTA

- View All Systems
- Open System Details

---

# 19. Screen 13 — Biomarker Detail

## Purpose

Explain a specific biomarker clearly.

## Example

Cortisol

Value:

560 nmol/L

Status:

Above range

## Sections

### Chart

Shows trend over time.

### What Is This?

Simple explanation.

### Why Is It Important?

Explains impact on:

- Sleep
- Energy
- Immunity
- Weight
- Mood

### What Affects It?

Examples:

- Stress
- Lack of sleep
- Nutrition
- Training load
- Caffeine
- Alcohol

### How To Improve It?

Examples:

- Sleep 7–9 hours
- Walking
- Magnesium
- Meditation
- Lower evening stimulation

## CTA

- Ask AI
- View Related Recommendations

---

# 20. Screen 14 — Supplements

## Purpose

Show supplement recommendations and daily intake schedule.

## Tabs

### My Supplements

Shows current recommended stack.

### All Supplements

Shows supplement library.

## Stack Types

### Essential Stack

Only necessary supplements.

### Complete Stack

Full optimization stack.

## Supplement Card Includes

- Name
- Dosage
- Today’s status
- Next intake time
- Image/icon
- Details arrow

Example:

Omega-3
1000 mg
Today: Accepted
Next intake: 20:00

## Supplement Detail Screen Includes

- Why recommended
- Expected benefit
- Confidence level
- How to take
- With food / before food / after food
- Compatible supplements
- Course duration
- Safety note

## Safety Note

Every supplement recommendation must include:

> Before starting any supplement protocol, consult a qualified healthcare professional, especially if you have medical conditions, take medication, are pregnant, breastfeeding, or have allergies.

---

# 21. Screen 15 — Bee Product Optimization

## Purpose

Show natural optimization tools from bee products.

This can be part of Supplements or a separate subsection.

## Products

- Perga
- Royal Jelly
- Bee Pollen
- Honey
- Zabrus

## Priority Logic

Default priority:

1. Perga
2. Royal Jelly
3. Bee Pollen
4. Honey
5. Zabrus

## Card Includes

- Product name
- Reason
- How to use
- Expected benefit
- Allergy warning

## Positioning

Bee products are supportive optimization tools, not medical interventions.

---

# 22. Screen 16 — Nutrition

## Purpose

Show AI-generated nutrition recommendations.

## Main Tabs

### What to eat today

Daily meal suggestions.

### Ask AI

Nutrition assistant.

## Daily Nutrition Cards

- Breakfast
- Lunch
- Dinner
- Snack
- Water

Each card includes:

- Meal name
- Short description
- Image
- Option to modify

## Nutrition Principles

The Nutrition AI should prioritize:

- Foods close to natural state
- Minimally processed foods
- Nutrient density
- No refined sugar
- Bee products where appropriate
- Personal goals and health status

## CTA

- Ask AI
- Change Meal
- Save Meal
- Add Water

---

# 23. Screen 17 — AI Assistant

## Purpose

Allow direct interaction with Health Coach AI.

## AI Has Access To

- User profile
- Blood analysis
- Braverman result
- Motivation archetype
- Supplement stack
- Nutrition plan
- Progress history
- Current symptoms

## Capabilities

- Explain biomarkers
- Explain recommendations
- Adjust meal plan
- Answer supplement questions
- Help choose food
- Help interpret symptoms
- Update weekly plan

## Example User Questions

- What should I order at KFC?
- Why is my cortisol high?
- Can I take magnesium and zinc together?
- What should I eat today?
- Why do I feel tired?

## Safety Layer

AI should not diagnose disease.

AI should encourage professional consultation when appropriate.

---

# 24. Screen 18 — Weekly Plan

## Purpose

Show the user’s 7-day action plan.

## Layout

Horizontal day selector:

- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday

## Daily Checklist

Categories:

- Supplements
- Training
- Nutrition
- Walking
- Sleep
- Water
- Recovery practice

## Each Task Includes

- Icon
- Task name
- Short instruction
- Completion checkbox

## Progress

Example:

4 of 5 completed

---

# 25. Screen 19 — Clinic

## MVP Role

In MVP, Clinic can be implemented as an informational or semi-manual screen.

Full automatic clinic booking is a future feature.

## Purpose

Prepare the product for future clinic and laboratory integrations.

## Content

- My doctor
- Next appointment
- Recommendation history
- Analysis and prescriptions
- Messages

## Future Features

- Choose clinic
- Book appointment
- Sync blood test orders
- Doctor chat
- Calendar integration

---

# 26. Screen 20 — Success Stories

## Purpose

Increase trust and motivation.

## Content

- User stories
- Goal category filters
- Before / after progress
- Energy improvement
- Motivation improvement
- Weight change
- Biomarker progress

## Filters

- All
- Energy
- Weight loss
- Muscles
- Sleep
- Productivity

## Preview Mode

This screen should be available in Preview Mode to increase conversion.

---

# 27. Screen 21 — Profile

## Purpose

Manage user account, data, integrations, and settings.

## Header

- User photo
- Name
- Age
- Height
- Weight
- Profile completion percentage

## Menu Items

- Personal Data
- Goals and Plans
- Notifications
- Delivery Information
- Integrations
- Settings
- Help and Support

## Future Integrations

- Apple Health
- Google Fit
- Wearables
- Laboratory accounts

---

# 28. Notification Logic

The app should support reminders for:

- Supplements
- Water
- Walking
- Sleep time
- 14-day review
- Blood retesting
- Incomplete onboarding

Notification tone should be supportive, not aggressive.

Example:

> Time for magnesium. This supports recovery and better sleep.

---

# 29. 14-Day Review Flow

Every 14 days, AI initiates a review.

## Questions

- How is your energy?
- How is your mood?
- How is your motivation?
- How is your productivity?
- How is your sleep?
- Did anything get worse?
- Did anything improve?

## Output

AI updates:

- Today screen
- Weekly plan
- Supplement recommendations
- Nutrition plan
- Goal progress

---

# 30. MVP Priority

## Must Have

- Splash screen
- Preview mode
- Subscription screen
- Account creation after payment
- Profile setup
- Start checklist
- Blood analysis upload
- Braverman assessment
- AI Summary
- Today screen
- My Body screen
- Supplements screen
- Nutrition screen
- AI Assistant
- Weekly Plan
- Profile

## Should Have

- Success Stories
- Bee Product section
- Biomarker details
- 14-day review

## Could Have

- Clinic screen placeholder
- Delivery data integration
- Apple Health / Google Fit placeholders

## Not MVP

- Full clinic booking
- Automatic lab integrations
- Marketplace checkout
- Real supplement delivery automation
- Wearable synchronization

---

# 31. UX Success Criteria

The MVP UX is successful if users can:

1. Understand the app before registration.
2. Purchase subscription after seeing value.
3. Create an account after payment.
4. Complete initial setup without confusion.
5. Upload blood analysis.
6. Complete Braverman assessment.
7. Receive AI Summary.
8. Understand what limits their current state.
9. Follow Today’s Plan.
10. Return for the 14-day review.

---

# 32. Product Principle

Health Coach should not overwhelm users.

The app should convert complex health data into simple daily actions.

Final UX rule:

> Less interpretation. More clarity. More action.
