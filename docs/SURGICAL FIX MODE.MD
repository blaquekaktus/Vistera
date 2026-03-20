Apply only the approved minimal fix.

Approved root cause:
[paste diagnosis]

Allowed files to modify:
[list exact files]

Rules:
- smallest possible fix
- no refactors
- no unrelated cleanup
- no renames unless required
- do not modify any other files without asking first

After making changes, output exactly:

## Change Report
- Files changed
- Exact changes made
- Why each change was necessary
- What was broken before
- What is fixed now
- What was intentionally not changed
- Risks
- Verification results