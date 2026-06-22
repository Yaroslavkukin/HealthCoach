# HEALTH_SCORE_ENGINE.md

> Documentation status: domain specification. If this file conflicts with `CURRENT_SOURCE_OF_TRUTH.md`, `CURRENT_SOURCE_OF_TRUTH.md` wins.

## Documentation Status

This is a supporting domain document. For product scope and navigation decisions, follow `CURRENT_SOURCE_OF_TRUTH.md` and `PRODUCT_SCOPE.md` first.

## Project

Health Coach

## Document Purpose

This document defines how Health Coach calculates and displays user health scores, system scores, daily readiness scores, and progress indicators.

The Health Score Engine is used by:

- Today screen
- Body screen
- AI Summary
- 7-Day Plan
- 14-Day Review
- Supplement Engine
- Bee Products Engine
- Nutrition Engine
- Progress tracking

The engine is not a medical diagnostic system.

It is an informational health optimization layer designed to help users understand their current state and take clear daily action.

---

# 1. Core Philosophy

Health Coach should not overwhelm users with raw biomarkers.

The user should not need to understand every laboratory value.

The Health Score Engine converts complex data into simple scores, explanations, priorities, and actions.

Main principle:

> Complex data in. Simple action out.

The engine should always answer:

1. How am I doing?
2. What is limiting me?
3. What changed since last time?
4. What should I do next?

---

# 2. Score Types

The current product model uses five primary score groups.

## 2.1 Overall Health Score

Main dashboard score.

Displayed as:

```text
82 / 100
```

Purpose:

Show the user’s current overall optimization state.

---

## 2.2 Core State Scores

Displayed on the Today screen.

Scores:

- Energy Score
- Mood Score
- Motivation Score
- Productivity Score

These scores reflect how the user feels and functions in real life.

---

## 2.3 Biological System Scores

Displayed on the Body screen.

Scores:

- Hormonal System Score
- Thyroid System Score
- Metabolic System Score
- Nutritional System Score
- Stress & Recovery Score
- Inflammation Score
- Sleep System Score
- Digestive System Score

These scores explain possible physiological reasons behind the user’s condition.

---

## 2.4 Confidence Score

Every score should have a confidence level.

Possible values:

- High
- Medium
- Low

Confidence depends on data completeness.

Example:

A user who uploaded blood tests, completed Braverman, and filled lifestyle data receives higher confidence than a user who only completed a questionnaire.

---

## 2.5 Trend Score

Trend shows whether the user is improving, stable, or declining.

Possible values:

- Improving
- Stable
- Worsening
- Unknown

Trend should be calculated by comparing the latest score with the previous score.

---

# 3. Data Sources

The Health Score Engine uses four main data layers.

## 3.1 Biomarker Layer

Source:

- Blood analysis
- Laboratory values

Priority:

Highest

Purpose:

Identify objective physiological limitations.

---

## 3.2 Subjective Layer

Source:

- User symptoms
- 14-day review
- Daily self-reports

Priority:

High

Purpose:

Understand how the user actually feels.

---

## 3.3 Braverman Layer

Source:

- Braverman Assessment
- Motivation Archetype

Priority:

Medium

Purpose:

Understand motivation style, nervous system tendencies, and likely adherence patterns.

---

## 3.4 Behavior Layer

Source:

- Task completion
- Supplement adherence
- Sleep habits
- Walking/activity logs
- Nutrition logs

Priority:

Medium

Purpose:

Understand whether the user follows the plan and whether actions correlate with improvement.

---

# 4. Data Priority

When inputs conflict, the engine follows this priority order:

1. Blood analysis
2. User symptoms
3. Braverman Assessment
4. Progress history
5. Adherence data

Important rule:

If blood analysis looks normal but the user reports poor energy, poor mood, low motivation, or poor sleep, the engine must not say that everything is fine.

Instead, it should classify the result as:

```text
Biomarkers mostly normal, but subjective state requires attention.
```

The AI should then look at:

- Sleep
- Stress
- Lifestyle
- Nutrition
- Braverman profile
- Recovery
- Missing biomarkers

---

# 5. Score Scale

All scores use a 0–100 scale.

## 5.1 Score Bands

| Score | Label | UI Status |
|---|---|---|
| 85–100 | Optimized | Green |
| 70–84 | Good | Green |
| 50–69 | Needs Attention | Orange |
| 30–49 | Priority Focus | Red |
| 0–29 | Critical Attention | Red |

## 5.2 Product Language Rules

Avoid medical claims.

Use language such as:

- Needs attention
- May be limiting energy
- May affect recovery
- Consider discussing with a healthcare professional

Do not use language such as:

- Disease diagnosis
- You have a disorder
- This treatment will cure you

---

# 6. Biomarker Normalization

Different laboratories use different units and reference ranges.

The product should avoid hardcoding universal medical ranges whenever possible.

## 6.1 Preferred Baseline Approach

For every biomarker, store:

- value
- unit
- lab reference minimum
- lab reference maximum
- user age
- user gender
- marker category

Then classify the marker as:

- Below range
- Low-normal
- Optimal zone
- High-normal
- Above range
- Unknown

## 6.2 Marker Status Scoring

Suggested internal scoring:

| Marker Status | Score |
|---|---:|
| Optimal zone | 100 |
| Normal but not optimal | 80 |
| Borderline | 60 |
| Out of range | 35 |
| Significantly out of range | 15 |
| Missing | null |

## 6.3 Missing Biomarkers

Missing biomarkers should not be treated as bad.

They should reduce confidence, not reduce the score.

Example:

```text
Nutritional System Score: 72 / 100
Confidence: Medium
Reason: Vitamin D and B12 are available, but ferritin and mineral panel are missing.
```

---

# 7. Biological System Scores

Each biological system score is calculated from relevant biomarkers, symptoms, and lifestyle signals.

## 7.1 Hormonal System Score

Purpose:

Evaluate hormonal balance and performance potential.

Potential biomarkers:

- Testosterone
- Free Testosterone
- DHT
- SHBG
- Estradiol
- Prolactin
- LH
- FSH
- Progesterone
- Growth Hormone
- IGF-1

Related symptoms:

- Low motivation
- Low libido
- Low confidence
- Fatigue
- Poor recovery
- Low drive
- Emotional instability

Baseline calculation:

```text
Hormonal System Score =
70% biomarker status
20% related symptoms
10% trend/history
```

If biomarkers are missing:

```text
Hormonal System Score = preliminary
```

---

## 7.2 Thyroid System Score

Purpose:

Evaluate thyroid-related metabolic regulation and energy support.

Potential biomarkers:

- TSH
- Free T3
- Free T4
- Total T3
- Total T4
- Thyroglobulin

Related symptoms:

- Low energy
- Cold sensitivity
- Brain fog
- Slow metabolism
- Weight gain
- Low mood

Baseline calculation:

```text
Thyroid System Score =
75% biomarker status
20% related symptoms
5% trend/history
```

---

## 7.3 Metabolic System Score

Purpose:

Evaluate glucose regulation and metabolic efficiency.

Potential biomarkers:

- HbA1c
- Glucose
- Insulin
- C-Peptide
- Leptin
- Lipid profile

Related symptoms:

- Energy crashes
- Sugar cravings
- Post-meal fatigue
- Brain fog after eating
- Weight gain
- Poor appetite control

Baseline calculation:

```text
Metabolic System Score =
70% biomarker status
20% nutrition/lifestyle data
10% symptoms
```

---

## 7.4 Nutritional System Score

Purpose:

Evaluate nutrient sufficiency and micronutrient-related limitations.

Potential biomarkers:

- Vitamin D
- Vitamin B12
- Ferritin
- Serum iron
- Transferrin
- B vitamins
- Mineral panel
- Fat-soluble vitamins

Related symptoms:

- Fatigue
- Low concentration
- Poor mood
- Weakness
- Poor recovery
- Hair/skin/nail issues

Baseline calculation:

```text
Nutritional System Score =
75% biomarker status
15% nutrition quality
10% symptoms
```

---

## 7.5 Stress & Recovery Score

Purpose:

Evaluate stress load, recovery capacity, and nervous system readiness.

Potential biomarkers:

- Cortisol
- DHEA-S
- Homocysteine

Related inputs:

- Sleep quality
- Stress level
- Workload
- Emotional overload
- Training load
- Rest days

Related symptoms:

- Anxiety
- Irritability
- Poor sleep
- Morning fatigue
- Evening overstimulation
- Burnout symptoms

Baseline calculation:

```text
Stress & Recovery Score =
40% biomarker status
35% sleep and stress data
15% symptoms
10% adherence to recovery practices
```

---

## 7.6 Inflammation Score

Purpose:

Evaluate systemic inflammatory load and recovery burden.

Potential biomarkers:

- CRP
- Fibrinogen
- ECP
- LDH
- ALT
- AST

Related symptoms:

- Low energy
- Slow recovery
- Brain fog
- Joint discomfort
- Frequent illness

Baseline calculation:

```text
Inflammation Score =
80% biomarker status
15% symptoms
5% trend/history
```

---

## 7.7 Sleep System Score

Purpose:

Evaluate sleep quality, circadian rhythm, and daily recovery.

Potential inputs:

- Sleep duration
- Bedtime
- Wake time
- Sleep quality
- Night awakenings
- Morning freshness
- Evening stimulation
- Light exposure

Related biomarkers:

- Cortisol
- Vitamin D
- Glucose/metabolic markers

Baseline calculation:

```text
Sleep System Score =
60% subjective sleep data
20% circadian habits
10% stress/recovery markers
10% sleep task adherence
```

---

## 7.8 Digestive System Score

Purpose:

Evaluate digestion-related limitations that may affect energy, mood, and nutrient absorption.

Potential inputs:

- Bloating
- Post-meal fatigue
- Appetite
- Stool regularity
- Food intolerance
- Processed food intake
- Sugar intake

Potential biomarkers:

- ALT
- AST
- Bilirubin
- Urea
- Total protein
- Mineral deficiencies
- Inflammation markers

Baseline calculation:

```text
Digestive System Score =
50% symptoms
30% nutrition quality
20% available biomarkers
```

Digestive System Score may be marked as Low Confidence if user did not complete nutrition and symptom questionnaires.

---

# 8. Core State Scores

Core State Scores are displayed on the Today screen.

They combine subjective state with relevant biological systems.

---

## 8.1 Energy Score

Purpose:

Estimate current energy availability.

Inputs:

- User-reported energy
- Sleep System Score
- Nutritional System Score
- Metabolic System Score
- Thyroid System Score
- Stress & Recovery Score
- Hormonal System Score

Baseline formula:

```text
Energy Score =
35% user-reported energy
20% Sleep System Score
15% Nutritional System Score
10% Metabolic System Score
10% Thyroid System Score
10% Stress & Recovery Score
```

If user-reported energy is missing:

Redistribute its weight across biological systems and reduce confidence.

---

## 8.2 Mood Score

Purpose:

Estimate emotional well-being.

Inputs:

- User-reported mood
- Stress & Recovery Score
- Sleep System Score
- Nutritional System Score
- Braverman attention-area signals
- Lifestyle stress

Baseline formula:

```text
Mood Score =
40% user-reported mood
20% Stress & Recovery Score
15% Sleep System Score
15% Nutritional System Score
10% Braverman emotional risk signals
```

---

## 8.3 Motivation Score

Purpose:

Estimate drive, initiative, and ability to start action.

Inputs:

- User-reported motivation
- Hormonal System Score
- Dopamine-related Braverman signals
- Sleep System Score
- Stress & Recovery Score
- Goal progress

Baseline formula:

```text
Motivation Score =
35% user-reported motivation
20% Hormonal System Score
15% Braverman motivation profile
15% Sleep System Score
10% Stress & Recovery Score
5% goal progress
```

---

## 8.4 Productivity Score

Purpose:

Estimate ability to focus, execute tasks, and maintain performance.

Inputs:

- User-reported productivity
- Energy Score
- Motivation Score
- Sleep System Score
- Braverman cognitive profile
- Daily task completion

Baseline formula:

```text
Productivity Score =
30% user-reported productivity
20% Energy Score
15% Motivation Score
15% Sleep System Score
10% Braverman cognitive profile
10% task completion
```

---

# 9. Overall Health Score

The Overall Health Score is the main score on the Today screen.

It should reflect both objective biology and subjective life experience.

## 9.1 Biological Readiness Score

Calculated from biological system scores.

Baseline formula:

```text
Biological Readiness Score =
20% Hormonal System Score
15% Thyroid System Score
15% Metabolic System Score
20% Nutritional System Score
15% Stress & Recovery Score
10% Sleep System Score
5% Inflammation Score
```

Digestive System Score may be added in future or included when enough data exists.

---

## 9.2 User State Score

Calculated from core state scores.

Baseline formula:

```text
User State Score =
30% Mood Score
25% Energy Score
25% Motivation Score
20% Productivity Score
```

This reflects the product priority:

1. Emotional state
2. Energy
3. Motivation
4. Productivity

---

## 9.3 Adherence Score

Purpose:

Track whether the user follows recommended actions.

Inputs:

- Supplement adherence
- Sleep target completion
- Walking/activity completion
- Nutrition task completion
- 7-day plan completion

Baseline formula:

```text
Adherence Score =
completed tasks / planned tasks * 100
```

Adherence should influence recommendations, but it should not dominate the Health Score.

---

## 9.4 Overall Health Score Formula

Baseline formula:

```text
Overall Health Score =
55% Biological Readiness Score
35% User State Score
10% Adherence Score
```

Why:

- Blood analysis is the highest-priority data source.
- User feelings still matter strongly.
- Adherence helps explain short-term progress.

---

# 10. Confidence Calculation

Every score must include confidence.

## 10.1 Data Completeness Inputs

Confidence depends on whether the user completed:

- Blood analysis
- Braverman Assessment
- Lifestyle questionnaire
- Nutrition questionnaire
- 14-day review
- Daily check-ins

## 10.2 Confidence Levels

### High Confidence

Requirements:

- Blood analysis uploaded
- Braverman completed
- Lifestyle questionnaire completed
- Recent user feedback available

### Medium Confidence

Requirements:

- At least blood analysis or Braverman completed
- Some symptoms or lifestyle data available

### Low Confidence

Used when:

- No blood analysis
- No Braverman
- Only partial self-report data

## 10.3 UI Display

Example:

```text
Health Score: 74 / 100
Confidence: Medium
```

Explanation:

```text
This score is based on your uploaded blood analysis and lifestyle questionnaire. Complete the Braverman Assessment to improve personalization.
```

---

# 11. Trend Logic

## 11.1 Trend Calculation

Compare current score to previous score.

Suggested thresholds:

| Change | Trend |
|---:|---|
| +5 or more | Improving |
| -4 to +4 | Stable |
| -5 or less | Worsening |

## 11.2 Trend Display

Example:

```text
Energy Score: 78
+6 since last review
Trend: Improving
```

---

# 12. AI Explanation Layer

Every score must be explainable.

For each score, AI should generate:

1. Short explanation
2. Top limiting factors
3. Top supporting factors
4. Recommended next actions

## Example

```text
Energy Score: 62 / 100

Your energy appears limited by poor sleep, low vitamin D, and elevated stress signals.

Top actions:
1. Stabilize bedtime.
2. Follow magnesium protocol.
3. Increase morning sunlight exposure.
```

---

# 13. Top Limiting Factors

The engine should identify the top 3–5 factors limiting the user’s state.

Possible limiting factor categories:

- Sleep
- Stress
- Nutrition
- Low vitamin D
- Low ferritin
- Hormonal imbalance
- Thyroid markers
- Metabolic instability
- Inflammation
- Low adherence
- Missing data

These limiting factors should appear in:

- AI Summary
- Today screen
- Body screen
- Weekly Plan

---

# 14. Recommendation Connection

Scores should influence recommendations.

## 14.1 Low Nutritional System Score

May trigger:

- Supplement Engine
- Nutrition Engine
- Bee Products Engine
- Retesting recommendations

## 14.2 Low Stress & Recovery Score

May trigger:

- Sleep protocol
- Magnesium
- L-theanine
- Recovery practices
- Walking plan
- Lower stimulation routine

## 14.3 Low Motivation Score

May trigger:

- Braverman-specific coaching
- Goal simplification
- Dopamine-friendly task design
- Hormonal review
- Sleep review

## 14.4 Low Mood Score

May trigger:

- Sleep stabilization
- Stress reduction
- Nutrition review
- Medical consultation warning if severe

---

# 15. Daily Update Logic

The Health Score should not fluctuate too aggressively every day.

## Daily Inputs

- Task completion
- Sleep feedback
- Energy rating
- Mood rating
- Motivation rating
- Productivity rating

## Daily Score Behavior

Daily changes should be smoothed.

Suggested baseline rule:

```text
Displayed Daily Score =
80% previous displayed score
20% new calculated score
```

This prevents confusing jumps.

---

# 16. 14-Day Review Logic

Every 14 days, the AI asks the user:

- How is your energy?
- How is your mood?
- How is your motivation?
- How is your productivity?
- How is your sleep?
- What improved?
- What got worse?

The review updates:

- User State Score
- Trend Score
- AI Summary
- Weekly Plan
- Supplement recommendations
- Nutrition recommendations

---

# 17. Retesting Logic

Blood analysis should not be required too frequently.

The engine may suggest retesting when:

- User completed a supplement protocol
- 6–12 weeks passed since last relevant biomarker test
- Symptoms did not improve
- Symptoms worsened
- Critical biomarkers need follow-up

The engine should not pressure users to test too often.

---

# 18. UI Requirements

## 18.1 Today Screen

Show:

- Overall Health Score
- Energy Score
- Mood Score
- Motivation Score
- Today’s tasks
- AI Insight

## 18.2 Body Screen

Show:

- Biological System Scores
- Human body visualization
- System statuses
- Trends

## 18.3 AI Summary

Show:

- Top limiting factors
- What matters most now
- Expected improvement window
- Recommended next step

## 18.4 Profile / Progress

Show:

- Score history
- 14-day review history
- Biomarker history
- Goal progress

---

# 19. Baseline Implementation Strategy

The baseline implementation should not attempt to create perfect medical scoring.

The baseline implementation should include:

1. Simple deterministic scoring rules
2. Confidence levels
3. AI-generated explanations
4. Trend tracking
5. Clear UI labels

## Important Architecture Rule

Scoring should be deterministic.

AI should explain the score but should not be the only source of score calculation.

Recommended approach:

```text
Backend scoring function calculates score
↓
AI receives structured score data
↓
AI generates explanation and recommendations
```

This improves consistency and reduces hallucinations.

---

# 20. Pseudocode

```ts
function calculateOverallHealthScore(input: HealthScoreInput): HealthScoreResult {
  const systemScores = calculateBiologicalSystemScores(input);
  const coreScores = calculateCoreStateScores(input, systemScores);

  const biologicalReadinessScore = weightedAverage({
    hormonal: [systemScores.hormonal, 0.20],
    thyroid: [systemScores.thyroid, 0.15],
    metabolic: [systemScores.metabolic, 0.15],
    nutritional: [systemScores.nutritional, 0.20],
    recovery: [systemScores.recovery, 0.15],
    sleep: [systemScores.sleep, 0.10],
    inflammation: [systemScores.inflammation, 0.05],
  });

  const userStateScore = weightedAverage({
    mood: [coreScores.mood, 0.30],
    energy: [coreScores.energy, 0.25],
    motivation: [coreScores.motivation, 0.25],
    productivity: [coreScores.productivity, 0.20],
  });

  const adherenceScore = calculateAdherenceScore(input.tasks);

  const overall = weightedAverage({
    biological: [biologicalReadinessScore, 0.55],
    userState: [userStateScore, 0.35],
    adherence: [adherenceScore, 0.10],
  });

  return {
    overall,
    biologicalReadinessScore,
    userStateScore,
    adherenceScore,
    systemScores,
    coreScores,
    confidence: calculateConfidence(input),
    trend: calculateTrend(input.previousScores, overall),
    limitingFactors: detectLimitingFactors(input, systemScores, coreScores),
  };
}
```

---

# 21. Safety Layer

The Health Score Engine must not diagnose disease.

If biomarkers are significantly outside reference ranges or symptoms are severe, the AI should recommend consulting a qualified healthcare professional.

Examples:

- Severe fatigue with abnormal blood markers
- Severe mood decline
- Chest pain
- Fainting
- Persistent unexplained symptoms
- Very abnormal lab values

Standard safety wording:

```text
These insights are informational and do not replace medical advice. Please consult a qualified healthcare professional before making medical decisions or starting supplement protocols.
```

---

# 22. Future Expansion

Future versions may include:

- Wearable integration
- Heart rate variability
- Resting heart rate
- Sleep tracker data
- Continuous glucose data
- AI prediction of future score changes
- Personalized biomarker optimal ranges
- User-specific response modeling
- Cohort comparison
- Qualified-professional review layer, only after separate owner approval
- Advanced safety flag detection

---

# 23. Final Product Rule

The score is not the product.

The action plan is the product.

Scores exist only to help the user understand why the action plan matters.

Final rule:

> Every score must lead to an explanation and every explanation must lead to an action.
