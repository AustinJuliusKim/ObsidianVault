#!/bin/zsh
# Weekly vault lint: deterministic checks, then a headless Claude pass that
# adjudicates stale repo claims and writes 00-inbox/Vault Lint Report.md.
# Run by launchd (com.aukim.vault-lint); safe to run manually.
set -euo pipefail

# launchd starts with a bare PATH; claude lives in ~/.local/bin, node in homebrew
export PATH="/Users/aukim/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

VAULT=/Users/aukim/personal/ObsidianVault
PROJECTS=/Users/aukim/personal/projects
REPORT="00-inbox/Vault Lint Report.md"
cd "$VAULT"

echo "=== vault-lint $(date '+%Y-%m-%d %H:%M') ==="

JSON=$(node "$VAULT/tools/vault-lint.mjs" --json)

PROMPT=$(cat <<EOF
Stdin is the JSON output of this vault's deterministic linter (tools/vault-lint.mjs).
You are running headless inside the Obsidian vault at $VAULT.

Do NOT fix any notes — this is a report-only run. The ONLY file you may write is
"$REPORT" (overwrite it).

1. For each entry in repoClaimCandidates (a backticked repo path in a 30-projects/
   note that does not exist in $PROJECTS), use the provided context snippet — and
   Read the source note if the snippet is ambiguous — to classify it:
   - stale: the note asserts this path exists in the code today, but it doesn't.
   - historical: the note (or its Status section) marks this as describing deleted
     or past code.
   - aspirational: planned/future work ("planned", "future homes", "no code this
     pass", roadmap items).
   Only "stale" entries are actionable findings.

2. Overwrite "$REPORT" with:
   - Vault frontmatter: title: Vault Lint Report / aliases: [] /
     tags: [meta, lint] / type: inbox / status: seed / created: (preserve the
     existing file's created date if the file exists, else today) /
     updated: today (YYYY-MM-DD) / related: []
   - Sections: Broken links, Orphans, Stale repo claims (adjudicated), Reviewed
     not actionable (historical/aspirational, one line each with the class),
     Warnings, Counts. Say "None" under any empty section.
   - Write broken-link targets and note names as plain text, NOT [[wikilinks]] —
     the report must not itself introduce dangling links.

3. Commit exactly that one file:
   git add "$REPORT" && git commit -m "vault-lint: weekly report $(date +%Y-%m-%d)"
EOF
)

print -r -- "$JSON" | claude -p "$PROMPT" \
  --model sonnet \
  --allowedTools "Read" "Glob" "Grep" "Write" "Bash(git add:*)" "Bash(git commit:*)" "Bash(git status:*)" \
  --add-dir "$PROJECTS"

# Safety net: commit the report ourselves if claude wrote it but didn't commit
if [ -n "$(git status --porcelain -- "$REPORT")" ]; then
  git add "$REPORT"
  git commit -m "vault-lint: weekly report $(date +%Y-%m-%d)"
fi

git push origin HEAD || echo "WARN: push failed (offline or conflict); report committed locally"
echo "=== vault-lint done $(date '+%Y-%m-%d %H:%M') ==="
