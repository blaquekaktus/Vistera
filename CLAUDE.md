# Vistera Engineering Manifesto

## I. Core Engineering Principle
"Fix the problem, not the codebase."
Favor minimal, controlled, and reversible fixes over clever or broad refactors. Refactoring during a bug fix is considered a failure condition.

## II. Technical Environment & Constraints
- **Framework:** Next.js 14 (App Router).
- **React:** STRICT React 18. Do NOT use React 19 APIs (e.g., useActionState). Use useFormState from react-dom.
- **Database:** Supabase + Prisma ORM.
    - Handle strict TypeScript inference for .select() queries.
    - NO any types for database rows; use generated types or explicit interfaces.
    - Prefer SQL-level fixes for data issues over code workarounds.
- **VR Domain:**
    - panorama_url must be a valid equirectangular 360 image.
    - vr_tours and properties are separate; do not assume a property image is a VR asset.
    - **Market Philosophy:** Global-ready from Day 1. While the initial test market is Austria/DACH, the system must remain geographically agnostic.
- **Architecture Requirements:**
    - **Dynamic Localization:** Currency symbols ($/€/CHF), units (m²/sqft), and address formats must be driven by data, not hard-coded in the UI.
    - **Neutral Aesthetic:** The UI must remain premium and neutral. Do not use region-specific imagery (mountains, oceans) in the base components.
    - **Timezone/Climate Agnostic:** Features like "Sunlight Simulation" or "Property Details" must handle diverse global environments (tropical, alpine, urban).
- **Expansion Readiness:** Ensure the database schema for `properties` uses generic fields (e.g., `region`, `country`, `postal_code`) rather than country-specific formats.

## III. Operational Protocol (The Workflow)

### 1. The "Read-Before-Action" Mandatory Sequence
Before a single line of code is modified, you must provide a Diagnosis:
- **Root Cause:** Deep analysis of the error chain, not just the symptom.
- **Affected Files:** List every file in the impact radius.
- **Systemic Check:** Is this pattern repeated (e.g., if fixing 'Delete', check 'Add' and 'Edit')?
- **Minimal Fix Plan:** Propose the smallest surgical change required.

### 2. Surgical Implementation Rules
- **Smallest Footprint:** Change the absolute minimum code necessary.
- **No Refactoring:** Do not improve unrelated code or rename variables.
- **UI Integrity:** Never nest <form> elements. Buttons inside forms must have explicit type.
- **Feature Preservation:** Ensure Auth, Dashboard, and RLS policies remain untouched.

### 3. Mandatory Verification
- **Zero-Error Build:** `npm run build` or `npx tsc --noEmit` must be run locally.
- **Verification First:** Do NOT ask the user to test until the local build passes 100%.

## IV. Mandatory Output Format

### Stage 1: Diagnosis (Before Editing)
## 🔍 Diagnosis
- **Root Cause:** [Detailed explanation]
- **Impact Radius:** [Local vs. Systemic]
- **Affected Files:** [List]
- **Proposed Minimal Fix:** [Description]

### Stage 2: Reporting (After Editing)
## 📝 Change Report
- **Files Changed:** [List]
- **Exact Changes:** [Bullet points]
- **Reasoning:** [Why this specific fix?]
- **Risk Assessment:** [What could this affect?]
- **Verification Steps:** [Confirmation of build/lint pass]

## V. Failure Conditions & Safety
You have failed the task if:
- You modify files without an approved diagnosis.
- You introduce React 19 APIs or "clever" refactors.
- You ship code that fails a type-check.
- You fail to check for the same bug pattern in related features.

## VI. Regressive Impact Analysis
 Before proposing any code change, evaluate if the change degrades data fidelity, removes localized support, or simplifies the schema to a point where frontend components would crash. If a change is "easier" but "worse" for the product, it must be rejected.

**🔒 FINAL RULE: If uncertain, ASK instead of acting.**