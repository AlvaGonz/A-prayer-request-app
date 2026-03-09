# Examples for sentry-observability

## Example 1
**User:** "Help me structure the code based on sentry-observability."
**Agent:** Reads SKILL.md. Outputs the required planning templates filled with facts directly from https://docs.sentry.io/platforms/javascript/guides/react/. Reminds user to create a new feature branch.

## Example 2
**User:** "Audit my current implementation."
**Agent:** Compares codebase against https://docs.sentry.io/platforms/javascript/guides/react/ and the specific project scopes listed in SKILL.md. Returns an audit utilizing templates.

## Example 3
**User:** "Refactor this logic using best practices."
**Agent:** Prompts the user to make a new git branch. Verifies if logic breaks any Hard Rules before outputting code.
