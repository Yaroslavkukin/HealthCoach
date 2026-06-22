# CODEX_CONTEXT.md

## Use This First

This is the short handoff file for new Codex or ChatGPT sessions.

Read before making changes:

```text
/docs/CURRENT_SOURCE_OF_TRUTH.md
/docs/PRODUCT_SCOPE.md
/docs/CODEX_CONTEXT.md
/docs/REPO_IMPLEMENTATION_STATUS.md
/docs/UX_ARCHITECTURE.md
/docs/USER_FLOW.md
/docs/CODEX_TASK.md
```

## Product Summary

Health Coach is a mobile AI health coach product.

Current target bottom navigation:

```text
Today / Supplements / Body / AI / Profile
```

Core experience:

1. User completes profile and initial assessments.
2. User uploads or enters blood analysis data.
3. User completes Braverman assessment.
4. AI creates a health profile, scores, recommendations, and a plan.
5. User follows Today tasks, supplement routine, nutrition guidance, and weekly plan.
6. User asks AI questions and updates progress.
7. Recommendations adapt after progress reviews and new data.

## Non-Negotiable Rules

- Do not treat the project as a blank project to rebuild from scratch.
- Do not add a standalone `Goal` bottom tab.
- Do not document Clinic, marketplace checkout, delivery, or shipment as active scope.
- Do not expose DeepSeek or other provider keys in the Expo client.
- Do not add provider-specific references unless provider direction changes.
- Do not make medical diagnosis or treatment claims.
- Do not change route names blindly. Inspect the full `app/` tree first.
- Do not claim implementation status from docs alone.

## AI Boundary

AI calls belong in backend/server functions. The mobile client sends user context and receives safe, validated responses.

Expected provider variables:

```text
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-pro
```

## Recommended Codex Working Style

Work in small changes:

1. inspect the current code tree;
2. state the specific files to change;
3. implement one product slice;
4. run typecheck/lint/tests when available;
5. report what changed and what should be manually tested.

Do not ask Codex to build the entire product in one pass.
