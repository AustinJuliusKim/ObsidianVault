# tools/ — vault lint

Weekly lint of this vault against its own conventions (`.claude/CLAUDE.md`, `.claude/skills/wiki/SKILL.md`): broken wikilinks, orphan notes, and stale repo claims in `30-projects/` (backticked `apps|packages|services` paths checked against `~/personal/projects`).

- `vault-lint.mjs` — deterministic checks. `node tools/vault-lint.mjs` (human output) or `--json`.
- `vault-lint-weekly.sh` — runs the linter, then headless `claude -p` (sonnet) adjudicates stale-vs-historical-vs-aspirational repo claims and writes `00-inbox/Vault Lint Report.md`, commits it, and pushes. Report-only: never edits other notes.
- `com.aukim.vault-lint.plist` — launchd agent, Mondays 09:03. If the Mac is asleep the run fires on wake; runs missed while powered off are skipped.

## Install

```sh
mkdir -p ~/Library/LaunchAgents
cp tools/com.aukim.vault-lint.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.aukim.vault-lint.plist
```

Test a run now: `launchctl kickstart -k gui/$(id -u)/com.aukim.vault-lint`, then check `~/Library/Logs/vault-lint.log`.

Uninstall: `launchctl bootout gui/$(id -u)/com.aukim.vault-lint`.

Headless `claude` uses your keychain login; if runs fail with auth errors after a credential expiry, re-login in an interactive `claude` session (or export `ANTHROPIC_API_KEY` in the wrapper).
