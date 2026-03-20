# Claude Control Prompts – Vistera

This file contains structured prompt templates to control Claude Code and prevent uncontrolled or incomplete changes.

Always follow the sequence:
1. Diagnose
2. Approve
3. Fix
4. Verify

---

# 🧪 1. DIAGNOSTIC MODE (MANDATORY FIRST STEP)

Use this BEFORE any code changes.

```text
Diagnostic mode only. Do not change any files.

Problem:
[describe the bug]

Goal:
Identify the real root cause with minimal assumptions.

Allowed files to inspect:
[list files or folders]

Output exactly:

## Diagnosis
- Root cause
- Affected files
- Impact radius
- Minimal safe fix
- Risks
- Verification plan

Also answer:
- Is this local or systemic?
- Does it affect create/edit/view/delete flows?
- Which files must NOT be touched?

