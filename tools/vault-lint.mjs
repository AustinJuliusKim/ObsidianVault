#!/usr/bin/env node
// vault-lint: enforces the vault conventions in .claude/CLAUDE.md and .claude/skills/wiki/SKILL.md
//   1. broken wikilinks (title/alias resolution, Planned-section links exempt)
//   2. orphans (notes unreachable from 10-maps/Home MOC.md)
//   3. repo-claim candidates (backticked apps|packages|services paths in 30-projects/
//      that don't exist in the sibling projects repo — adjudicated downstream by LLM)
// Zero dependencies. Node >= 18. Exit 0 even with findings; nonzero only on crash.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const VAULT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PROJECTS = '/Users/aukim/personal/projects';
const SKIP_DIRS = new Set(['.git', '.obsidian', '.claude', 'tools']);
const HOME_MOC = '10-maps/Home MOC.md';
const TEMPLATE_DIR = '50-templates';
const ORPHAN_EXEMPT_DIRS = ['00-inbox', TEMPLATE_DIR, '90-archive'];
const REPO_CLAIM_DIR = '30-projects';

const WIKILINK_RE = /\[\[([^\]|#]+)(#[^\]|]*)?(\|[^\]]*)?\]\]/g;

// ---------- collect notes ----------

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (entry.name.endsWith('.md')) {
      out.push(path.relative(VAULT, path.join(dir, entry.name)));
    }
  }
  return out;
}

// ---------- parsing ----------

// Minimal frontmatter parse: scalar `key: value`, inline flow lists `[a, b]`,
// and block lists (`- item`). Only title/aliases/related are consumed.
function parseNote(relPath) {
  const raw = fs.readFileSync(path.join(VAULT, relPath), 'utf8');
  const lines = raw.split('\n');
  const fm = {};
  let bodyStart = 0;
  if (lines[0]?.trim() === '---') {
    let end = -1;
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') { end = i; break; }
    }
    if (end > 0) {
      bodyStart = end + 1;
      let lastKey = null;
      for (let i = 1; i < end; i++) {
        const line = lines[i];
        const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
        if (m) {
          lastKey = m[1];
          fm[lastKey] = { value: m[2].replace(/\s+#.*$/, '').trim(), line: i + 1, list: [] };
        } else if (lastKey && /^\s*-\s+/.test(line)) {
          fm[lastKey].list.push(line.replace(/^\s*-\s+/, '').trim());
        }
      }
    }
  }
  return { relPath, lines, fm, bodyStart };
}

function flowList(value) {
  const m = value.match(/^\[(.*)\]$/s);
  if (!m) return null;
  return m[1].split(',').map((s) => s.trim()).filter(Boolean);
}

// ---------- resolver: lowercased title/basename/alias -> relPath ----------

const warnings = [];
const notes = walk(VAULT).map(parseNote);
const resolver = new Map();

function addKey(key, relPath) {
  const k = key.toLowerCase().trim();
  if (!k) return;
  const existing = resolver.get(k);
  if (existing && existing !== relPath) {
    warnings.push(`duplicate resolution key "${k}": ${existing} vs ${relPath}`);
    return;
  }
  resolver.set(k, relPath);
}

for (const note of notes) {
  addKey(path.basename(note.relPath, '.md'), note.relPath);
  if (note.fm.title?.value) addKey(note.fm.title.value, note.relPath);
  const aliases = note.fm.aliases
    ? flowList(note.fm.aliases.value) ?? note.fm.aliases.list
    : [];
  for (const a of aliases) addKey(a, note.relPath);
}

// ---------- link extraction ----------

// Returns [{target, line, planned}] from the note body (code stripped) plus related: frontmatter.
function extractLinks(note) {
  const links = [];
  const headingStack = []; // headingStack[level-1] = latest heading text at that level
  let inFence = false;
  for (let i = note.bodyStart; i < note.lines.length; i++) {
    const line = note.lines[i];
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      headingStack[level - 1] = h[2];
      headingStack.length = level;
      continue;
    }
    const planned = headingStack.some((t) => t && /planned/i.test(t));
    const scannable = line.replace(/`[^`]*`/g, '');
    for (const m of scannable.matchAll(WIKILINK_RE)) {
      links.push({ target: m[1].trim(), line: i + 1, planned });
    }
  }
  if (note.fm.related) {
    const relatedRaw = note.fm.related.value + ' ' + note.fm.related.list.join(' ');
    for (const m of relatedRaw.matchAll(WIKILINK_RE)) {
      links.push({ target: m[1].trim(), line: note.fm.related.line, planned: false });
    }
  }
  return links;
}

// ---------- check 1: broken links · graph edges for check 2 ----------

const brokenLinks = [];
const edges = new Map(); // relPath -> Set of resolved target relPaths
let linksChecked = 0;

for (const note of notes) {
  const isTemplate = note.relPath.startsWith(TEMPLATE_DIR + path.sep);
  if (isTemplate) continue; // templates are link targets, never link sources
  const targets = new Set();
  for (const link of extractLinks(note)) {
    linksChecked++;
    const resolved = link.target && resolver.get(link.target.toLowerCase());
    if (resolved) {
      targets.add(resolved);
    } else if (!link.planned) {
      brokenLinks.push({ source: note.relPath, line: link.line, target: link.target });
    }
  }
  edges.set(note.relPath, targets);
}

// ---------- check 2: orphans (BFS from Home MOC) ----------

const orphans = [];
if (!edges.has(HOME_MOC)) {
  warnings.push(`root note ${HOME_MOC} not found — orphan check skipped`);
} else {
  const visited = new Set([HOME_MOC]);
  const queue = [HOME_MOC];
  while (queue.length) {
    for (const next of edges.get(queue.shift()) ?? []) {
      if (!visited.has(next)) { visited.add(next); queue.push(next); }
    }
  }
  for (const note of notes) {
    if (visited.has(note.relPath)) continue;
    if (ORPHAN_EXEMPT_DIRS.some((d) => note.relPath.startsWith(d + path.sep))) continue;
    orphans.push(note.relPath);
  }
}

// ---------- check 3: repo-claim candidates ----------

// Normalize one backticked token into zero or more repo-relative paths to existence-check.
function normalizeClaim(token) {
  let t = token.trim();
  const brace = t.match(/^(.*?)\{([^}]*)\}(.*)$/);
  const expanded = brace
    ? brace[2].split(',').map((part) => brace[1] + part.trim() + brace[3])
    : [t];
  const out = [];
  for (let p of expanded) {
    p = p.replace(/^(personal\/)?projects\//, '');
    p = p.replace(/:~?\d+(-\d+)?$/, '');
    p = p.replace(/\/$/, '');
    if (/^(apps|packages|services)\/[^\s*<>]+$/.test(p)) out.push(p);
  }
  return out;
}

const repoClaimCandidates = [];
const seenClaims = new Set();
for (const note of notes) {
  if (!note.relPath.startsWith(REPO_CLAIM_DIR + path.sep)) continue;
  let inFence = false;
  for (let i = note.bodyStart; i < note.lines.length; i++) {
    const line = note.lines[i];
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    for (const span of line.matchAll(/`([^`]+)`/g)) {
      for (const claim of normalizeClaim(span[1])) {
        const key = `${note.relPath}\0${claim}`;
        if (seenClaims.has(key)) continue;
        seenClaims.add(key);
        if (!fs.existsSync(path.join(PROJECTS, claim))) {
          repoClaimCandidates.push({
            source: note.relPath,
            line: i + 1,
            token: span[1],
            path: claim,
            context: note.lines.slice(Math.max(note.bodyStart, i - 3), i + 4).join('\n'),
          });
        }
      }
    }
  }
}

// ---------- output ----------

const result = {
  ranAt: new Date().toISOString(),
  vault: VAULT,
  projectsRepo: PROJECTS,
  brokenLinks,
  orphans,
  repoClaimCandidates,
  warnings,
  counts: {
    notes: notes.length,
    linksChecked,
    brokenLinks: brokenLinks.length,
    orphans: orphans.length,
    repoClaimCandidates: repoClaimCandidates.length,
    warnings: warnings.length,
  },
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  const c = result.counts;
  console.log(`vault-lint: ${c.notes} notes, ${c.linksChecked} links checked\n`);
  console.log(`Broken links (${c.brokenLinks}):`);
  for (const b of brokenLinks) console.log(`  ${b.source}:${b.line}  [[${b.target}]]`);
  console.log(`\nOrphans (${c.orphans}):`);
  for (const o of orphans) console.log(`  ${o}`);
  console.log(`\nRepo-claim candidates (${c.repoClaimCandidates}) — need adjudication (stale vs historical vs planned):`);
  for (const r of repoClaimCandidates) console.log(`  ${r.source}:${r.line}  ${r.path}`);
  console.log(`\nWarnings (${c.warnings}):`);
  for (const w of warnings) console.log(`  ${w}`);
}
