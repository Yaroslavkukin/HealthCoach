# BEE_PRODUCTS_ENGINE.md

> Documentation status: domain specification. If this file conflicts with `CURRENT_SOURCE_OF_TRUTH.md`, `CURRENT_SOURCE_OF_TRUTH.md` wins.

## Documentation Status

This is a supporting domain document. For product scope and navigation decisions, follow `CURRENT_SOURCE_OF_TRUTH.md` and `PRODUCT_SCOPE.md` first.

## Purpose

The Bee Products Engine is responsible for recommending bee-derived products when they may support energy, recovery, cognitive performance, immunity, stress adaptation, and overall well-being.

Bee products are considered supportive interventions.

They do not replace:

- Sleep
- Nutrition
- Physical activity
- Stress management
- Essential supplements

They are used to complement the user's optimization plan.

---

# Core Philosophy

Bee products should only be recommended when they provide meaningful additional value.

The AI should never recommend bee products as a replacement for correcting fundamental health issues.

Priority order:

1. Sleep
2. Nutrition
3. Physical activity
4. Stress management
5. Essential supplements
6. Bee products

---

# Bee Product Library

## Honey

### Honey — Description

Natural source of carbohydrates, enzymes, antioxidants, and bioactive compounds.

### Honey — Primary Benefits

- Quick energy support
- Recovery support
- Immune support

### Honey — AI Priority

Medium

### Honey — Recommended For

- High physical activity
- Low energy
- Recovery periods
- High cognitive workload

### Honey — Suggested Pairings

- Magnesium
- Omega-3
- CoQ10

### Honey — Avoid If

- Allergy to bee products
- Uncontrolled diabetes

---

## Bee Pollen

### Bee Pollen — Description

Flower pollen collected by bees.

Rich in amino acids, micronutrients, and biologically active compounds.

### Bee Pollen — Primary Benefits

- Energy support
- Recovery support
- Immune support

### Bee Pollen — AI Priority

Medium

### Bee Pollen — Recommended For

- Frequent fatigue
- High training volume
- Chronic stress
- Nutritional support

### Bee Pollen — Suggested Pairings

- Vitamin D
- Magnesium
- Zinc
- Omega-3

### Bee Pollen — Avoid If

- Allergy to bee products
- Pollen allergy

---

## Perga

### Perga — Description

Fermented bee pollen with enhanced bioavailability.

### Perga — Primary Benefits

- Energy support
- Cognitive support
- Recovery support

### Perga — AI Priority

High

### Perga — Recommended For

- Chronic fatigue
- Reduced productivity
- Burnout
- Stress-related exhaustion
- Low energy
- Reduced concentration

### Perga — Suggested Pairings

- Magnesium
- Omega-3
- B Vitamins
- CoQ10

### Perga — Avoid If

- Allergy to bee products

---

## Royal Jelly

### Royal Jelly — Description

Nutrient-dense secretion produced by worker bees.

### Royal Jelly — Primary Benefits

- Vitality support
- Cognitive support
- Stress adaptation

### Royal Jelly — AI Priority

High

### Royal Jelly — Recommended For

- Persistent fatigue
- Reduced motivation
- High cognitive workload
- Chronic stress

### Royal Jelly — Suggested Pairings

- Magnesium
- Omega-3
- Vitamin D
- Adaptogens

### Royal Jelly — Avoid If

- Allergy to bee products

---

## Zabrus

### Zabrus — Description

Wax cappings from honeycomb containing traces of honey and propolis.

### Zabrus — Primary Benefits

- Oral hygiene support
- Gum support
- Breath freshness

### Zabrus — AI Priority

Low

### Zabrus — Recommended For

- Oral health support
- General wellness

### Zabrus — Suggested Pairings

No specific pairings required.

### Zabrus — Avoid If

- Allergy to bee products

---

# Goal-Based Recommendation Logic

## Goal: Increase Energy

Priority:

1. Perga
2. Royal Jelly
3. Bee Pollen
4. Honey

## Goal: Improve Recovery

Priority:

1. Perga
2. Bee Pollen
3. Honey

## Goal: Improve Motivation

Priority:

1. Royal Jelly
2. Perga

## Goal: Improve Cognitive Performance

Priority:

1. Royal Jelly
2. Perga

## Goal: Support Immunity

Priority:

1. Bee Pollen
2. Honey
3. Perga

---

# Strategic Priority Layer

## Core Bee Product

Within the Health Coach ecosystem, Perga is considered the primary bee product.

### Reasoning

Perga directly supports the main objectives of the application:

- Energy optimization
- Cognitive performance
- Recovery
- Productivity
- Stress resilience

Compared to other bee products, Perga has the strongest alignment with the mission of Health Coach.

---

## Default Bee Product Priority

Unless a specific user condition suggests otherwise, the AI should prioritize bee products in the following order:

1. Perga
2. Royal Jelly
3. Bee Pollen
4. Honey
5. Zabrus

---

## Perga Recommendation Rule

The AI should strongly consider Perga when one or more of the following are present:

- Chronic fatigue
- Reduced productivity
- Low energy
- Cognitive fatigue
- Burnout symptoms
- High stress exposure
- Recovery difficulties
- General performance optimization goals

Perga may appear in either:

- Essential Optimization Layer
- Complete Optimization Layer

depending on the user's overall condition.

---

# AI Recommendation Rules

The AI must always explain:

- Why the product is recommended
- Expected benefit
- Expected timeframe
- How to use it
- Which products it can be combined with

The AI should recommend bee products only when they support the user's goals or current condition.

Bee products should never be presented as a treatment for disease.

---

# Product Positioning

Within the application, bee products should be positioned as:

Natural Optimization Tools

rather than:

Medical Interventions

---

# Safety Layer

The AI must remind users:

- Bee products may cause allergic reactions.
- Users with known allergies should avoid bee products.
- Users with medical conditions should consult a healthcare professional before use.

The AI must never present bee products as medical treatment.


---

# Commerce Boundary

Bee product recommendations are informational product guidance only. Marketplace checkout, order collection, and automatic delivery are not active product scope.
