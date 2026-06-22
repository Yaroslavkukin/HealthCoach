# Braverman Test Research and Implementation

> Documentation status: domain specification. If this file conflicts with `CURRENT_SOURCE_OF_TRUTH.md`, `CURRENT_SOURCE_OF_TRUTH.md` wins.

## Documentation Status

This is a supporting domain document. For product scope and navigation decisions, follow `CURRENT_SOURCE_OF_TRUTH.md` and `PRODUCT_SCOPE.md` first.

## 1. Overview

The Braverman Test is a long True/False self-assessment commonly organized around four neurotransmitter-related behavioral profiles: dopamine, acetylcholine, GABA, and serotonin.

Inside Health Coach, the Braverman Test should be used as a motivational and behavioral personalization layer. It can help adapt recommendation tone, habit framing, reminders, Today tasks, nutrition framing, and planning language to the user's self-reported profile.

The test must not be presented as a medical diagnostic tool. It does not measure exact neurotransmitter levels, does not confirm a clinical state, and must not be used to prescribe medication or make clinical claims. User-facing language should say that answers suggest a profile or may point to an attention area.

## Legal And Product Boundary

The full public Braverman questionnaire text may be copyrighted. Health Coach should not copy the full public questionnaire into the repository unless the product owner confirms usage rights.

For production, prefer one of these options:

- A user-provided licensed or explicitly approved source file.
- An original Health Coach-adapted question bank that follows the same scoring structure but does not copy original wording.

This document intentionally describes structure, scoring, data models, and implementation implications only. It does not reproduce the full questionnaire text.

## 2. Source Structure

The source packet documents the commonly used public structure:

- 315 total True/False items.
- Part 1: items 1-200.
- Part 1 purpose: dominant nature / dominant profile.
- Part 2: items 201-315.
- Part 2 purpose: deficiency / attention areas.
- Answer format: True / False.
- True adds 1 point.
- False adds 0 points.

Part 1 is generally answered based on how the user feels most of the time. Part 2 is generally answered based on how the user feels right now.

## 3. Part 1 Dominant Nature Blocks

Part 1 contains four dominant nature blocks:

- 1A: Dopamine nature.
- 2A: Acetylcholine nature.
- 3A: GABA nature.
- 4A: Serotonin nature.

Each True answer adds 1 point to the corresponding block. False adds 0 points.

Scoring interpretation:

- The highest score is the dominant profile.
- The second-highest score is the secondary profile.
- The lowest score can be stored as an opposite profile, weaker side, or balancing area.
- The lowest score must not be presented as a diagnosis.

Safe product framing:

- Use "dominant profile", "secondary profile", "area to balance", or "weaker pattern".
- Avoid implying a medical state from Part 1 alone.

## 4. Part 2 Deficiency / Attention Blocks

Part 2 contains four deficiency / attention blocks:

- 1B: Dopamine deficiency / attention area.
- 2B: Acetylcholine deficiency / attention area.
- 3B: GABA deficiency / attention area.
- 4B: Serotonin deficiency / attention area.

Each True answer adds 1 point to the corresponding deficiency block. False adds 0 points.

Scoring interpretation:

- The highest score is the main attention area.
- Health Coach must not use harsh medical wording like "major deficiency".
- Health Coach should use product-safe labels:
  - 0-5: low attention.
  - 6-15: medium attention.
  - 16+: high attention.

User-facing copy should describe Part 2 as an attention area, not as proof of a biological deficiency.

## 5. Question Data Model

Future question data should be typed and source-mapped. The app should not store the questionnaire as one untyped flat string list.

```ts
export type BravermanNeurotransmitter =
  | 'dopamine'
  | 'acetylcholine'
  | 'gaba'
  | 'serotonin';

export type BravermanQuestionType =
  | 'dominant'
  | 'deficiency';

export type BravermanSourceBlock =
  | '1A'
  | '2A'
  | '3A'
  | '4A'
  | '1B'
  | '2B'
  | '3B'
  | '4B';

export type BravermanQuestion = {
  id: string;
  order: number;
  text: string;
  neurotransmitter: BravermanNeurotransmitter;
  type: BravermanQuestionType;
  sourceBlock: BravermanSourceBlock;
};
```

## 6. Scoring Logic

Future scoring should be deterministic and simple:

- True = 1.
- False = 0.

Calculate dominant scores:

- dopamine.
- acetylcholine.
- gaba.
- serotonin.

Calculate deficiency / attention scores:

- dopamine.
- acetylcholine.
- gaba.
- serotonin.

Derived fields:

- `dominantProfile` = highest dominant score.
- `secondaryProfile` = second-highest dominant score.
- `oppositeProfile` = lowest dominant score.
- `mainAttentionArea` = highest deficiency / attention score.
- `attentionSeverity` = low / medium / high based on the attention score:
  - 0-5: low.
  - 6-15: medium.
  - 16+: high.

If the highest Part 2 score is high, the UI may recommend that the user discuss significant symptoms with a qualified professional, using careful non-diagnostic wording.

## 7. Tie Handling

Tie handling should be safe and transparent:

- If two dominant scores are equal or very close, show a mixed profile.
- Example: `Смешанный профиль: дофамин + ацетилхолин`.
- Do not force a single diagnosis in user-facing text.
- For internal UI personalization only, use deterministic order:
  - dopamine
  - acetylcholine
  - gaba
  - serotonin
- User-facing text must mention that the scores are close.

Recommended rules:

- Exact tie for highest Part 1 score: show mixed profile and list both profiles.
- Scores within 1-2 points: show primary profile plus a close secondary profile note.
- Exact tie for lowest Part 1 score: avoid strong "opposite nature" wording and show multiple balance areas.
- Exact tie for highest Part 2 score: show multiple zones of attention.

## 8. Health Coach Archetype Mapping

Health Coach should map the four profiles into motivational archetypes:

- dopamine -> `Стратег`
  - Goals, progress, achievement, drive, clear action.
- acetylcholine -> `Создатель`
  - Creativity, ideas, learning, novelty, flexible thinking.
- gaba -> `Хранитель`
  - Stability, structure, consistency, routines, calm.
- serotonin -> `Исследователь`
  - Mood, flexibility, recovery, enjoyment, experience.

These archetypes are product-personalization labels. They should not be presented as clinical categories.

## 9. Result Object

Future result model:

```ts
export type BravermanResult = {
  completedAt: string;
  scores: {
    dominant: {
      dopamine: number;
      acetylcholine: number;
      gaba: number;
      serotonin: number;
    };
    attention: {
      dopamine: number;
      acetylcholine: number;
      gaba: number;
      serotonin: number;
    };
  };
  dominantProfile: BravermanNeurotransmitter;
  secondaryProfile: BravermanNeurotransmitter;
  oppositeProfile: BravermanNeurotransmitter;
  mainAttentionArea: BravermanNeurotransmitter;
  attentionSeverity: 'low' | 'medium' | 'high';
  motivationArchetype: 'Стратег' | 'Создатель' | 'Хранитель' | 'Исследователь';
  isMixedProfile: boolean;
};
```

## 10. User-Facing Wording Rules

### Allowed Russian Wording

- `Ваш мотивационный архетип: Стратег`
- `Ответы указывают на выраженный дофаминовый профиль.`
- `Главная зона внимания: GABA — стрессоустойчивость и восстановление.`
- `Это может быть связано с усталостью, напряжением или трудностью сохранять спокойный ритм.`
- `Тест используется для персонализации рекомендаций и не является медицинской диагностикой.`

### Forbidden Russian Wording

- `У вас дефицит дофамина.`
- `У вас болезнь.`
- `Тест показал точный уровень нейромедиаторов.`
- `Вам нужно лечение.`
- `Нужно принимать препарат.`
- `Это диагноз.`

### General Copy Rules

Use careful wording:

- `может быть связано`
- `может влиять`
- `требует внимания`
- `может ограничивать`
- `поможет понять`
- `направления для улучшения`

Avoid clinical certainty and prescription language. Do not imply the test measures exact neurotransmitter concentration.

## 11. Result Card Specification

The future result card on the "Тест Бравермана" screen should include:

- `Результат теста`
- `Ваш мотивационный архетип: ...`
- `Доминирующий профиль: ...`
- `Вторичный профиль: ...`
- `Зона внимания: ...`
- Short simple Russian explanation.
- Safety note: `Тест не является медицинской диагностикой и используется для персонализации рекомендаций.`

Example safe structure:

- Title: `Результат теста`
- Archetype line: `Ваш мотивационный архетип: Стратег`
- Profile line: `Доминирующий профиль: дофамин`
- Secondary line: `Вторичный профиль: ацетилхолин`
- Attention line: `Зона внимания: GABA — стрессоустойчивость и восстановление`
- Explanation: "Ответы помогают Health Coach подобрать тон рекомендаций, привычки и план действий."
- Safety note as above.

## 12. Implementation Notes

Recommended implementation steps:

- Add `src/types/braverman.ts`.
- Add `src/data/bravermanQuestions.ts`.
- Add `src/lib/bravermanScoring.ts`.
- Add a separate route/screen for taking the test.
- Add `Пройти тест` button to the main Braverman screen.
- After completion, show the result on the main Braverman screen.
- Keep all logic local for now.
- Do not add persistence unless the task explicitly includes storage.
- Do not add AI interpretation unless the task explicitly includes AI.
- Do not add provider-specific user-facing AI references.

Implementation notes:

- The test is long, so a one-question-at-a-time flow is safer than rendering all items on one screen.
- Add progress indicator and question counter.
- Consider save/resume behavior later, but keep it local until persistence is explicitly requested.
- Importing a licensed question file should be a separate task after usage rights are confirmed.

## 13. Source Packet Note

Source packet used during research; these files may not be present in every docs-only archive:

- `braverman_assessment_full_source.pdf`
- `braverman_part2_deficiencies_scoring_source.pdf`
- `braverman_psytests_structure_source.pdf`
- `braverman_faq_interpretation_and_disclaimer_source.pdf`

