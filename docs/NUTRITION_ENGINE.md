# NUTRITION_ENGINE.md

> Documentation status: domain specification. If this file conflicts with `CURRENT_SOURCE_OF_TRUTH.md`, `CURRENT_SOURCE_OF_TRUTH.md` wins.

## Documentation Status

This is a supporting domain document. For product scope and navigation decisions, follow `CURRENT_SOURCE_OF_TRUTH.md` and `PRODUCT_SCOPE.md` first.

## Project

Health Coach

## Document Purpose

This document defines how the Nutrition Engine works inside the Health Coach mobile application.

The Nutrition Engine is responsible for generating, correcting, and explaining food recommendations based on the user’s goals, blood analysis, lifestyle, symptoms, Braverman profile, supplement plan, bee product plan, and progress history.

The Nutrition Engine is not a medical diet prescription system.

It is an AI-powered personalization layer designed to help the user eat in a way that supports:

- Energy
- Emotional state
- Motivation
- Productivity
- Recovery
- Sleep
- Body composition
- Long-term well-being

---

# 1. Core Philosophy

Health Coach should not give generic diet advice.

The Nutrition Engine should turn the user’s health data and daily context into simple food decisions.

Main principle:

> Natural food first. Clear action always.

The user should not need to understand nutrition science in detail.

The app should answer:

1. What should I eat today?
2. What should I avoid?
3. How should I improve my current diet?
4. What should I order if I am outside?
5. How does food affect my energy, mood, motivation, and productivity?

---

# 2. Role Inside Health Coach

The Nutrition Engine is one of the major recommendation modules used by the AI Recommendation Engine.

It interacts with:

- AI Recommendation Engine
- Health Score Engine
- Supplements Engine
- Bee Products Engine
- Blood Analysis System
- Braverman Engine
- Today Screen
- Weekly Plan
- 14-Day Review
- AI Assistant

The Nutrition Engine should work both as:

1. A structured recommendation engine
2. A conversational AI nutrition agent

---

# 3. Nutrition AI Agent

Health Coach should include a dedicated AI Nutrition Agent.

## Purpose

The Nutrition AI Agent helps users make better food decisions in real life.

It can:

- Analyze the user’s current diet
- Create food recommendations
- Correct an existing meal plan
- Suggest meals for today
- Suggest practical choices in restaurants or from takeout menus
- Explain why specific foods are recommended or restricted
- Adapt nutrition to biomarkers and symptoms
- Adjust food recommendations after 14-day reviews

## Example Questions

The user may ask:

- What should I eat for breakfast?
- What is the safest practical option if I am eating at a fast-food restaurant?
- Is this meal good for my current goal?
- What should I eat if I feel tired?
- What should I avoid with high insulin?
- What can I eat instead of sugar?
- How can I improve my diet without cooking complicated meals?

---

# 4. Data Sources

The Nutrition Engine uses the following data sources.

## 4.1 User Profile

- Age
- Gender
- Height
- Weight
- Country
- City
- Work type
- Activity level
- Primary goals

## 4.2 Blood Analysis

Examples:

- Glucose
- HbA1c
- Insulin
- C-peptide
- Leptin
- Ferritin
- Iron markers
- Vitamin D
- Vitamin B12
- B vitamins
- ALT
- AST
- Bilirubin
- Lipid markers
- CRP
- Homocysteine
- Thyroid markers

## 4.3 User Symptoms

Examples:

- Fatigue
- Brain fog
- Anxiety
- Low motivation
- Poor sleep
- Digestive discomfort
- Sugar cravings
- Low appetite
- Overeating
- Post-meal sleepiness

## 4.4 Lifestyle Data

- Typical day
- Sleep schedule
- Meal schedule
- Physical activity
- Stress level
- Training frequency
- Workload

## 4.5 Nutrition Description

The user describes:

- What they usually eat
- How many meals per day
- Sugar consumption
- Processed food consumption
- Alcohol consumption
- Caffeine consumption
- Water intake
- Food preferences
- Food dislikes
- Allergies
- Dietary restrictions

## 4.6 Braverman Profile

The Nutrition Engine uses Braverman results to personalize communication and adherence strategy.

It should not use Braverman as a medical nutrition diagnostic tool.

## 4.7 Progress History

- 14-day review answers
- Completed nutrition tasks
- Weight changes
- Energy changes
- Mood changes
- Sleep changes
- Biomarker changes

---

# 5. Nutrition Output Types

The Nutrition Engine can generate the following outputs.

## 5.1 Nutrition Summary

A short explanation of the user’s current nutritional situation.

Example:

> Your current nutrition likely reduces energy stability because it contains too much refined sugar and too few nutrient-dense foods.

## 5.2 Essential Nutrition Plan

The minimum necessary food changes.

This plan should contain only the most important steps.

Example:

- Remove refined sugar
- Add protein to breakfast
- Add mineral-rich foods
- Replace sweet snacks with fruit, berries, honey, or bee products when appropriate

## 5.3 Complete Nutrition Plan

A broader food optimization plan.

May include:

- Meal timing
- Food quality upgrades
- Hydration
- Protein strategy
- Micronutrient support
- Meal examples
- Shopping suggestions
- Restaurant guidance

## 5.4 Daily Meal Suggestions

The app can suggest:

- Breakfast
- Lunch
- Dinner
- Snacks
- Drinks
- Bee product use

## 5.5 Meal Correction

The user may submit a meal or diet description.

AI returns:

- What is good
- What should be removed
- What should be added
- A better version of the meal

## 5.6 Restaurant / Takeout Guidance

This means food-choice guidance only. No ordering, checkout, or delivery-address collection belongs in the active Nutrition Engine scope.

The user may ask what to order from a specific place.

AI should suggest the best available option according to current goals and restrictions.

## 5.7 Shopping List

Future feature.

AI can generate a shopping list based on the nutrition plan.

---

# 6. Food Quality Hierarchy

The Nutrition Engine should prioritize foods by quality.

## Tier 1 — Natural, Nutrient-Dense Foods

Preferred food category.

Examples:

- Berries
- Fruits
- Greens
- Vegetables
- Fresh meat
- Eggs
- Fish
- Seafood
- High-quality animal products
- Natural honey
- Bee products
- Herbs
- Natural mineral-rich foods

## Tier 2 — Minimally Processed Foods

Acceptable when useful and well tolerated.

Examples:

- Fermented foods
- Simple dairy products if tolerated
- Natural yogurt without sugar
- Simple cooked vegetables
- Bone broth
- Simple protein sources

## Tier 3 — Functional Foods

Used selectively.

Examples:

- Functional cacao
- Smart chocolate without refined sugar overload
- Protein supplements
- Extracts
- Special nutrition products

## Tier 4 — Processed Foods

Should be reduced or avoided.

Examples:

- Refined flour products
- Industrial sweets
- Ultra-processed snacks
- Sugary drinks
- Fast food
- Processed meats
- Refined oils
- Artificial desserts

---

# 7. Core Nutrition Rules

## 7.1 Natural Food Rule

The Nutrition Engine should prefer foods that are close to their natural state.

The system should recommend minimally processed food whenever possible.

## 7.2 Safe Preparation Rule

The Nutrition Engine may recommend raw fruits, berries, greens, honey, and some vegetables when safe and appropriate.

However, animal products should be prepared safely.

The AI must not recommend unsafe raw animal products.

## 7.3 Refined Sugar Rule

The Nutrition Engine should strongly reduce or eliminate refined sugar.

The AI should suggest natural alternatives when appropriate:

- Fruit
- Berries
- Honey
- Bee products
- Better meal timing
- More protein
- More nutrient density

## 7.4 Processed Food Rule

The Nutrition Engine should reduce ultra-processed food.

The AI should explain the replacement rather than only saying “do not eat this.”

Example:

Instead of:

> Do not eat sweets.

Better:

> Replace evening sweets with berries and honey after dinner, or use perga in the morning if the goal is stable energy.

## 7.5 Simplicity Rule

The user should not receive an overwhelming diet.

For the initial active scope, the AI should recommend a small number of high-impact nutrition changes first.

Default:

- 1–3 essential changes
- 3–7 complete-plan recommendations

## 7.6 Personalization Rule

Nutrition recommendations must be adapted to:

- User goals
- Biomarkers
- Symptoms
- Lifestyle
- Food preferences
- Schedule
- Budget if provided
- Cooking ability if provided

---

# 8. Bee Products in Nutrition

Bee products can appear inside nutrition recommendations when appropriate.

Possible products:

- Honey
- Perga
- Bee pollen
- Royal jelly
- Zabrus

## Usage Philosophy

Bee products are natural optimization tools.

They should not replace:

- Sleep
- Basic nutrition
- Physical activity
- Stress management
- Essential supplements

## Default Nutrition Use Cases

### Honey

Used for:

- Natural energy support
- Sugar replacement
- Recovery support

### Perga

Used for:

- Energy support
- Cognitive support
- Chronic fatigue
- Productivity support

### Bee Pollen

Used for:

- Nutritional support
- Recovery
- Immune support

### Royal Jelly

Used for:

- Vitality
- Motivation
- Stress adaptation

### Zabrus

Used for:

- Oral hygiene
- Post-meal chewing routine

## Safety

Bee products must not be recommended to users with known allergies to bee products or pollen.

---

# 9. Biomarker-Based Nutrition Logic

The Nutrition Engine should adjust recommendations based on available biomarkers.

## 9.1 Glucose / HbA1c / Insulin

If glucose regulation markers are unfavorable, AI should prioritize:

- Removing refined sugar
- Reducing ultra-processed carbohydrates
- Increasing protein quality
- Improving meal timing
- Avoiding constant snacking
- Supporting walking after meals

AI should recommend professional consultation if values may indicate serious metabolic issues.

---

## 9.2 Ferritin / Iron Markers

If iron-related markers are low, AI may recommend:

- Iron-rich foods
- Red meat if acceptable
- Seafood
- Foods paired with vitamin C sources
- Avoiding tea or coffee around iron-rich meals

AI must not present iron correction as medical treatment.

If a nutrient-related gap appears significant, AI should recommend consulting a qualified healthcare professional.

---

## 9.3 Vitamin D

If vitamin D is low, AI may recommend:

- Fatty fish
- Eggs
- Sunlight exposure habits
- Vitamin D supplement protocol via Supplements Engine

Nutrition alone should not be presented as the only correction method for low vitamin D.

---

## 9.4 B Vitamins / B12

If B vitamins or B12 appear low, AI may recommend:

- Animal foods if acceptable
- Eggs
- Seafood
- Meat
- Nutrient-dense meals
- Supplement support if necessary

---

## 9.5 Magnesium / Minerals

If symptoms or markers suggest mineral support is needed, AI may recommend:

- Mineral-rich foods
- Greens
- Seafood
- Mineral water if appropriate
- Reduced stress load
- Magnesium support via Supplements Engine

---

## 9.6 ALT / AST / Bilirubin

If liver-related markers are elevated, AI should be careful.

Possible recommendations:

- Reduce alcohol
- Reduce fried foods
- Reduce ultra-processed food
- Avoid extreme diets
- Prefer simple, easy-to-digest meals

If values are significantly abnormal, AI should recommend professional medical evaluation.

---

## 9.7 Lipid Markers

If lipid markers require attention, AI may recommend:

- Better fat quality
- More omega-3-rich foods
- Less ultra-processed food
- Less refined sugar
- More whole foods

---

## 9.8 CRP / Inflammation

If inflammatory markers are elevated, AI may recommend:

- Removing refined sugar
- Reducing ultra-processed foods
- Improving sleep
- Increasing omega-3-rich foods
- Supporting gut health
- Avoiding foods that worsen symptoms

---

## 9.9 Thyroid Markers

If thyroid-related markers require attention, AI should avoid making medical claims.

Possible supportive recommendations:

- Adequate protein
- Nutrient-dense diet
- Iodine-containing foods only when appropriate
- Selenium-containing foods when appropriate
- Professional consultation for abnormal values

---

# 10. Symptom-Based Nutrition Logic

## 10.1 Low Energy

AI may recommend:

- Protein-containing breakfast
- Natural carbohydrates instead of refined sugar
- Honey only when appropriate
- Perga in the morning if bee products are allowed
- Better hydration
- More nutrient-dense foods

## 10.2 Brain Fog

AI may recommend:

- Removing heavy processed meals
- Reducing refined sugar
- Better protein intake
- More omega-3-rich foods
- Avoiding overeating during work hours
- Testing response to meal timing

## 10.3 Anxiety / Stress

AI may recommend:

- Stable meals
- Avoiding excess caffeine
- Avoiding sugar spikes
- Magnesium-rich foods
- Warm evening drink ritual without sugar
- Zabrus chewing if appropriate and tolerated

## 10.4 Poor Sleep

AI may recommend:

- Avoid heavy meals close to bedtime
- Avoid caffeine late in the day
- Avoid sugar in the evening
- Use calm evening food routines
- Hydration earlier in the day
- Nutrition support for stable blood sugar overnight

## 10.5 Low Motivation

AI may recommend:

- Protein-rich first meal
- Nutrient-dense breakfast
- Natural energy support
- Perga or royal jelly if appropriate
- Avoiding sugar-driven energy spikes

## 10.6 Digestive Discomfort

AI may recommend:

- Simpler meals
- Reducing ultra-processed food
- Testing tolerance to dairy, gluten, and sugar
- Avoiding overeating
- Eating slower
- Tracking symptoms after meals

AI should recommend medical consultation if digestive symptoms are severe, persistent, or worsening.

---

# 11. Goal-Based Nutrition Logic

## 11.1 Goal: Increase Energy

Priority:

- Stable blood sugar
- Nutrient density
- Protein quality
- Hydration
- Natural energy sources
- Reduced refined sugar

## 11.2 Goal: Improve Emotional State

Priority:

- Stable meals
- Reduced sugar crashes
- Support gut health
- Support micronutrients
- Avoid alcohol overuse
- Support sleep through evening nutrition

## 11.3 Goal: Improve Motivation

Priority:

- Strong morning nutrition
- Avoid food patterns that cause lethargy
- Support dopamine-related food habits through protein and consistency
- Avoid excessive snacking

## 11.4 Goal: Improve Productivity

Priority:

- No heavy meals during deep work windows
- Stable hydration
- Smart caffeine timing
- Simple, repeatable meals
- Avoid post-meal crashes

## 11.5 Goal: Improve Sleep

Priority:

- Evening meal timing
- No refined sugar before sleep
- No caffeine late
- Calm evening drink ritual if appropriate
- Reduce digestive burden at night

## 11.6 Goal: Improve Recovery

Priority:

- Adequate protein
- Minerals
- Omega-3-rich foods
- Hydration
- Recovery-friendly carbohydrates when appropriate

## 11.7 Goal: Fat Loss

Priority:

- Remove refined sugar
- Reduce ultra-processed foods
- Increase protein adequacy
- Reduce liquid calories
- Improve satiety
- Increase walking after meals

## 11.8 Goal: Muscle Gain

Priority:

- Adequate calories
- Adequate protein
- Meal consistency
- Training support
- Recovery support

---

# 12. Braverman / Archetype Personalization

The same nutrition recommendation should be communicated differently depending on Motivation Archetype.

## The Strategist

Best style:

- Targets
- Metrics
- Performance logic

Example:

> Your goal is stable energy. Keep breakfast protein consistent for the next 7 days and track energy after 2 hours.

## The Creator

Best style:

- Experiments
- Variety
- Discovery

Example:

> Try three different natural breakfasts this week and compare which one gives the clearest focus.

## The Guardian

Best style:

- Routine
- Structure
- Consistency

Example:

> Keep the same simple breakfast for 7 days to stabilize energy and reduce decision fatigue.

## The Explorer

Best style:

- Enjoyment
- Flexibility
- Experience

Example:

> Choose a fresh, enjoyable meal that gives energy without making you feel restricted.

---

# 13. Meal Timing Logic

The Nutrition Engine should consider timing.

## Morning

Possible focus:

- Stable energy
- Protein
- Natural foods
- Hydration
- Avoid sugar spike as first meal

## Midday

Possible focus:

- Productivity
- Avoid heavy crash meals
- Balanced food
- Hydration

## Evening

Possible focus:

- Recovery
- Sleep support
- Avoid stimulants
- Avoid heavy digestion close to sleep
- Avoid refined sugar

---

# 14. Hydration Logic

The Nutrition Engine should track hydration as part of the daily plan.

Recommendations may include:

- Daily water target
- More water during training days
- Earlier hydration to avoid sleep disruption
- Mineral support when appropriate

The AI should avoid extreme water recommendations.

---

# 15. Restaurant and Fast Food Mode

The Nutrition AI should help users make the best available choice, even in imperfect environments.

The AI should not shame the user.

Example:

User asks:

> What is the safest practical option if I am eating at a fast-food restaurant?

AI should respond with:

- Best available option
- What to avoid
- How to reduce damage
- How to return to plan next meal

Example structure:

1. Choose the least processed protein option available.
2. Avoid sugary drinks.
3. Avoid dessert.
4. Use water instead of soda.
5. Do not turn one imperfect meal into a failed day.

---

# 16. Nutrition Guidance UX

The Nutrition Guidance screen should have two main modes.

## 16.1 What To Eat Today

Shows daily meal suggestions:

- Breakfast
- Lunch
- Dinner
- Snack
- Water
- Bee products if relevant

Each card includes:

- Meal name
- Short explanation
- Replace button
- Ask AI button

## 16.2 Ask Nutrition AI

Conversational interface.

Examples:

- Analyze this meal
- Create breakfast
- What should I order?
- Replace sugar
- Make my dinner lighter

---

# 17. Today Screen Integration

Nutrition tasks can appear on the Today screen.

Examples:

- Eat protein breakfast
- Replace sugar today
- Follow your personalized hydration target
- Add berries instead of sweets
- Use honey instead of refined sugar
- Avoid caffeine after 14:00

Tasks should be concrete and easy to complete.

Bad task:

> Eat healthy.

Good task:

> Replace your evening sweet snack with berries and honey.

---

# 18. Weekly Plan Integration

Nutrition recommendations should be distributed across the 7-day plan.

The AI should avoid changing everything at once.

Example:

Day 1:

- Remove sugary drinks

Day 2:

- Add protein breakfast

Day 3:

- Add berries or fruit instead of dessert

Day 4:

- Improve lunch composition

Day 5:

- Adjust evening meal timing

Day 6:

- Review energy after meals

Day 7:

- Save what worked

---

# 19. 14-Day Review Logic

Every 14 days, the AI should ask nutrition-related questions.

## Questions

- Did your energy after meals improve?
- Did sugar cravings decrease?
- Did digestion improve?
- Did sleep change?
- Did mood change?
- Which meals were easiest to follow?
- Which recommendations were difficult?

## Output

AI updates:

- Nutrition plan
- Today tasks
- Weekly plan
- Supplement timing if food-related
- Bee product recommendations

---

# 20. Nutrition Recommendation Confidence

Each nutrition recommendation should include a confidence level.

## High Confidence

Used when biomarkers, symptoms, and diet description strongly support the recommendation.

Example:

High refined sugar intake + post-meal sleepiness + poor glucose markers.

## Medium Confidence

Used when symptoms and diet description support the recommendation but biomarkers are incomplete.

## Low Confidence

Used when the recommendation is optional or experimental.

Low-confidence recommendations should not appear as essential tasks.

---

# 21. Safety Layer

The Nutrition Engine must not diagnose diseases.

The Nutrition Engine must not claim to treat medical conditions.

It should recommend professional consultation when appropriate.

## Medical Escalation Triggers

Recommend consultation with a qualified healthcare professional if user reports or data suggests:

- Severe digestive symptoms
- Unexplained weight loss
- Eating disorder symptoms
- Very high or very low blood glucose markers
- Severe liver marker abnormalities
- Pregnancy or breastfeeding
- Diabetes
- Kidney disease
- Severe allergies
- Chronic medical conditions
- Medication interactions

## Eating Disorder Safety

The AI should avoid extreme restriction.

It should not encourage starvation, purging, or obsessive calorie control.

## Allergy Safety

The AI must ask about allergies and food intolerances before recommending risky foods or bee products.

## Diabetes Safety

Honey and high-sugar fruits should be recommended cautiously or avoided for users with uncontrolled diabetes or severe glucose dysregulation.

---

# 22. Output Format for AI

The AI should return structured nutrition recommendations.

Example:

```json
{
  "nutrition_summary": "Your current nutrition may be reducing energy stability because of refined sugar and low protein in the first half of the day.",
  "essential_plan": [
    {
      "action": "Remove refined sugar for 7 days",
      "reason": "Supports stable energy and reduces crashes",
      "confidence": "high"
    },
    {
      "action": "Add protein to breakfast",
      "reason": "Supports motivation and reduces morning fatigue",
      "confidence": "medium"
    }
  ],
  "complete_plan": [
    {
      "action": "Use berries or honey instead of processed sweets",
      "reason": "Provides a more natural alternative to refined sugar",
      "confidence": "medium"
    }
  ],
  "today_meals": {
    "breakfast": "Eggs with greens and fruit",
    "lunch": "Fish or meat with vegetables",
    "dinner": "Light protein meal with cooked vegetables",
    "snack": "Berries with honey if needed"
  },
  "warnings": [
    "Consult a qualified healthcare professional if you have diabetes, allergies, or chronic medical conditions."
  ]
}
```

---

# 23. Nutrition Engine Pseudocode

```text
function generateNutritionPlan(user):
    collect profile data
    collect blood analysis data
    collect symptoms
    collect nutrition description
    collect goals
    collect Braverman archetype

    identify nutrition limiting factors
    identify unsafe or restricted foods
    create essential nutrition plan
    create complete nutrition plan
    create daily meal suggestions
    create today tasks
    add safety notes
    personalize communication style by archetype
    return nutrition plan
```

---

# 24. Initial Active Scope

## Must Have

- Nutrition questionnaire
- Nutrition summary
- Essential nutrition plan
- Complete nutrition plan
- Daily meal suggestions
- Ask Nutrition AI
- Sugar reduction logic
- Natural food preference logic
- Bee product support logic
- Safety warnings

## Should Have

- Restaurant / fast food mode
- Meal correction
- 14-day nutrition review
- Nutrition tasks in Today screen

## Could Have

- Shopping list
- Recipe generator
- Photo meal analysis
- Calorie/macro tracking

## Not In Initial Active Scope

- Full medical diet therapy
- Automatic grocery ordering
- Deep calorie tracking
- Professional dietitian portal

---

# 25. Future Expansion

Future versions may include:

- AI meal photo analysis
- Grocery list generation
- Restaurant menu parsing
- Personalized recipe engine
- Macro and calorie tracking
- Family nutrition mode
- Nutrition programs for specific goals
- Optional partner recommendation links, only after separate owner approval

These are future ideas only. They do not add active ordering, checkout, delivery-address collection, or marketplace scope.

---

# 26. Final Product Principle

The Nutrition Engine should not make the user feel controlled.

It should make food decisions easier.

Final rule:

> Do not give the user a diet. Give the user the next better food decision.
