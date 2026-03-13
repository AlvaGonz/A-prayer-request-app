# Task Plan - Install addyosmani/web-quality-skills

## Objective
Copy 6 skill folders from addyosmani/web-quality-skills/skills/ into prayer-board/.agent/skills/

## Skill Install Checklist

- [x] **accessibility** - WCAG 2.2 guidelines, A11Y patterns, screen reader support
  - [x] SKILL.md
  - [x] references/A11Y-PATTERNS.md
  - [x] references/WCAG.md

- [x] **core-web-vitals** - LCP, INP, CLS optimization
  - [x] SKILL.md
  - [x] references/LCP.md

- [x] **performance** - Loading speed, runtime efficiency, resource optimization
  - [x] SKILL.md

- [x] **seo** - Search engine visibility, structured data, meta tags
  - [x] SKILL.md

- [x] **best-practices** - Security, compatibility, code quality
  - [x] SKILL.md

- [x] **web-quality-audit** - Comprehensive Lighthouse-based auditing
  - [x] SKILL.md
  - [x] scripts/analyze.sh

## Post-Install Checklist

- [x] Update .agent/skills/README.md with 6 new entries
- [x] Verify no content collision with existing skills
- [x] Create findings.md with overlap analysis
- [x] Create progress.md with session log

## Expected Final State
- 21 total skill folders in .agent/skills/ (15 existing + 6 new)
- All skills from addyosmani/web-quality-skills copied verbatim
- README.md updated with new entries
- Planning protocol files in tasks/
