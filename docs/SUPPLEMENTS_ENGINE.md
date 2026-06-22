# SUPPLEMENTS_ENGINE.md

> Documentation status: domain specification. If this file conflicts with `CURRENT_SOURCE_OF_TRUTH.md`, `CURRENT_SOURCE_OF_TRUTH.md` wins.

## Documentation Status

This is a supporting domain document. For product scope and navigation decisions, follow `CURRENT_SOURCE_OF_TRUTH.md` and `PRODUCT_SCOPE.md` first.

## Purpose

The Supplements Engine is responsible for selecting supplement recommendations based on the user's biomarkers, symptoms, goals, Braverman profile, lifestyle data, and progress history.

The engine must not recommend supplements randomly or excessively.

The main principle:

Only recommend supplements that are likely to meaningfully influence the user's current condition.

---

# Core Philosophy

Health Coach should not overwhelm users with long lists of supplements.

The AI must distinguish between:

1. Essential supplements
2. Supportive supplements

Essential supplements are those without which the desired improvement is unlikely or significantly harder to achieve.

Supportive supplements are those that may improve or accelerate results but are not absolutely necessary.

---

# Supplement Stack Types

## Essential Stack

Purpose:

Provide the minimum necessary supplement protocol.

This stack includes only supplements that are considered highly relevant to the user's current condition.

Examples:

- Clear biomarker gap or low-status signal
- Strong symptom match
- High-impact intervention
- High confidence recommendation

The Essential Stack should be simple, realistic, and easy to follow.

---

## Complete Stack

Purpose:

Provide a broader optimization protocol.

This stack includes:

- Essential supplements
- Additional supportive supplements
- Performance-supporting supplements
- Recovery-supporting supplements

The Complete Stack is intended for users who want maximum improvement and are willing to follow a more advanced protocol.

---

# Supplement Selection Logic

The AI evaluates:

1. Blood test results
2. User symptoms
3. Braverman profile
4. Lifestyle factors
5. Sleep quality
6. Emotional state
7. Energy level
8. Motivation
9. Productivity
10. Previous response to recommendations

The AI should only recommend a supplement when there is a clear reason.

---

# Recommendation Confidence

Each supplement recommendation should include a confidence level.

## High Confidence

Used when blood markers and symptoms strongly support the recommendation.

## Medium Confidence

Used when symptoms and user profile support the recommendation, but objective biomarkers are incomplete.

## Low Confidence

Used when the recommendation is optional or experimental.

Low-confidence supplements should not appear in the Essential Stack.

---

# Supplement Scheduling

The AI must automatically generate a supplement intake schedule.

The schedule should specify:

- Time of day
- Whether to take before food, with food, or after food
- Which supplements can be taken together
- Which supplements should be separated
- Course duration
- Retesting or reassessment point

Example structure:

## Morning

- Supplement A — with food
- Supplement B — after food

## Day

- Supplement C — before food

## Evening

- Supplement D — 1–2 hours before sleep

---

# Combination Logic

The AI must determine which supplements can be combined.

The AI should avoid:

- Unnecessary duplication
- Excessive stimulation
- Conflicting supplement effects
- Too many new supplements at once
- Overly complex protocols

The AI should prefer:

- Simple stacks
- Synergistic combinations
- Clear timing
- Gradual introduction when needed

---

# Safety Layer

The AI must include a safety note when recommending supplements.

Standard note:

Before starting any supplement protocol, consult a qualified healthcare professional, especially if you have medical conditions, take medication, are pregnant, breastfeeding, or have known allergies.

The AI must avoid presenting supplement recommendations as medical treatment.

For the current active scope, the system should not automatically recommend prescription medications, injectables, SARMs, peptides, experimental compounds, controlled substances, or other regulated substances as ordinary supplements.

---

# User Experience

The user should see two supplement options:

## Option 1: Essential Stack

The minimum necessary stack.

This is recommended for most users.

## Option 2: Complete Stack

A broader stack for maximum effect.

This is optional and should be clearly marked as more advanced.

---

# Output Format

Each supplement recommendation should include:

- Supplement name
- Reason for recommendation
- Expected benefit
- Confidence level
- Timing
- Food instructions
- Compatibility with other supplements
- Course duration
- Safety note

---

# Example Output

## Example Essential Stack

### Magnesium Bisglycinate

Reason:

Supports nervous system relaxation, stress regulation, sleep quality, and recovery.

Timing:

Evening, 1–2 hours before sleep.

Food:

Can be taken after dinner or before sleep.

Confidence:

High, if user reports anxiety, poor sleep, muscle tension, or high stress.

---

## Example Complete Stack

Includes Essential Stack plus additional supportive supplements selected according to user goals and current condition.


---

# Restricted Scope Boundary

The Supplements Engine must not recommend prescription medications, restricted compounds, experimental compounds, controlled substances, SARMs, peptides, or clinician-only products as ordinary user-facing wellness recommendations. Any future restricted catalog concept requires separate owner approval and must remain hidden from ordinary user-facing recommendations unless an appropriate regulated workflow is explicitly added.
