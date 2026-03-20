# Vistera – Claude Engineering Rules

## 🎯 Project Context
Vistera is a Next.js 14 + Supabase-based VR real estate platform.

Key systems:
- Auth (Supabase)
- Properties + VR Tours (separate tables)
- Dashboard (create/edit flows)
- Public listing + VR viewer

---

## 🚨 CRITICAL RULES

### 1. NEVER modify code before diagnosis
You must first:
- identify root cause
- identify affected files
- evaluate impact radius

Do NOT change any files until this is done.

---

### 2. SURGICAL FIXES ONLY
When fixing bugs:
- change the smallest possible amount of code
- do NOT refactor
- do NOT improve unrelated code
- do NOT rename variables/components unless required

---

### 3. STRICT FILE SCOPE
Only modify files explicitly approved.

If additional files seem necessary:
→ STOP and ask first

---

### 4. NO SILENT CHANGES
After ANY modification, you MUST provide:

## Change Report
- Files changed
- Exact reason for each change
- What was broken
- What was fixed
- What was NOT changed
- Risks introduced
- How it was verified

If this is missing → task is incomplete

---

### 5. PROJECT-AWARE THINKING
Before fixing anything, evaluate:

- Is this local or systemic?
- Does it affect:
    - create flow
    - edit flow
    - display logic
    - database logic
- Are similar patterns used elsewhere?

Report this BEFORE making changes.

---

### 6. DO NOT BREAK WORKING FEATURES
Preserve:
- working routes
- dashboard functionality
- auth flow
- database schema integrity

---

### 7. DATABASE RULES (Supabase)
- Do NOT change schema unless explicitly requested
- Prefer SQL fixes over code changes for data issues
- Always verify:
    - table relations
    - RLS policies (if relevant)
    - required fields

---

### 8. UI FORM RULES
When working with forms:
- never nest `<form>` elements
- buttons inside forms must have explicit type
- avoid mixing `onSubmit` + manual `.submit()`
- avoid conflicting server actions + client handlers

---

### 9. VR TOUR RULES
- VR tours require `vr_tours` table entries
- `panorama_url` must be:
    - public
    - valid 360 image (equirectangular)
- Do NOT assume property images are VR images

---

### 10. OUTPUT FORMAT (MANDATORY)

For diagnosis:

## Diagnosis
- Root cause
- Affected files
- Impact radius
- Minimal fix

---

For implementation:

## Change Report
- Files changed
- Exact changes made
- Why each change was necessary
- Risk assessment
- Verification steps

---

### 11. FAILURE CONDITIONS

You have failed if:
- you modify unrelated files
- you refactor during a bug fix
- you do not explain your changes
- you apply changes without diagnosis
- you introduce new bugs

---

## 🧠 ENGINEERING PRINCIPLE

"Fix the problem, not the codebase."

Prefer:
- minimal
- controlled
- reversible

over:
- clever
- broad
- optimized

---

## 🔒 FINAL RULE

If uncertain:
→ ASK instead of acting