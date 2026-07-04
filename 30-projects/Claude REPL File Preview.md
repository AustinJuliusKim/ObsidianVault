---
title: Claude REPL File Preview
aliases: [claude-repl-preview]
tags: [project, claude-repl, ui, feature-plan]
type: project
status: developing
created: 2026-07-03
updated: 2026-07-03
related: [[Claude REPL]], [[Claude REPL Architecture]], [[Claude REPL Lesson Plan]]
---
# Claude REPL — File Preview (feature plan, v0.1)

**Goal:** the workspace pane can *render* previewable files, not just show source/diff — HTML renders as the document, Markdown as formatted prose, JS as a mounted component. Strengthens the L1 "you shipped a live page" graduation beat: the learner sees the page, not markup.

## Design sketch
- **Entry point:** a Source / Diff / **Preview** toggle in `FileViewer` (`apps/guided-repl/src/components/FileViewer.jsx`); Preview enabled per file type, default-on for `.html` after a run completes.
- **HTML:** render in a **sandboxed iframe** (`srcdoc`, `sandbox="allow-scripts"`, never `allow-same-origin`). Resolve relative refs (`style.css`, images) against the virtualFs by rewriting to blob/data URLs before injection — multi-file lessons must preview whole.
- **Markdown:** small renderer (either a ~zero-dep lib or minimal hand-rolled subset: headings, emphasis, lists, links, code fences) → sanitized HTML into the same sandboxed iframe. No CSS framework, styled with the CLI theme tokens.
- **JS components:** render-the-component requires in-browser transpile/bundle (esbuild-wasm or Sandpack-style). **Phase 2** — significant weight; MVP ships HTML+MD only with the JS case showing "preview coming" + source.

## Constraints / gotchas
- **Security is load-bearing:** today's content is curated fixtures, but live BYOK mode replays untrusted LLM output — the sandbox boundary (no same-origin, no top-navigation) is non-negotiable and must be designed in now, not retrofitted.
- Preview reads only from virtualFs (reducer state) — no new transport/frame types needed; zero protocol change, §12 invariant untouched.
- e2e: new testids (`preview-toggle`, `preview-frame`); assert L1 preview shows the rendered page (iframe present + srcdoc non-empty), not pixel content.
- Pedagogy hook: L6 (reading diffs) could later contrast source-diff vs visual-diff of the planted bug.

## Rough phasing
1. **P-A: DONE (2026-07-03)** — Source/Diff/Preview tabs in FileViewer; sandboxed HTML preview (`sandbox="allow-scripts"`, no same-origin) with virtualFs refs rewritten to `data:` URIs (deviation from the blob-URL sketch: blob fetchability from an opaque-origin sandbox is unreliable, and data: URIs need no revocation lifecycle). Diff stays the default view after a run (protects the L1 "diff pane opened" assertion) — preview is an opt-in tab, not auto-open.
2. **P-B: DONE (2026-07-03)** — Markdown via `marked` (no DOMPurify: the sandboxed iframe is the single sanitization boundary, documented in FileViewer.jsx; invariant breaks if `allow-same-origin` is ever added or preview leaves the iframe). CLI-theme typography injected as literal hex (iframe can't see parent CSS vars). Executable url schemes (javascript:/vbscript:) stripped from refs as defense-in-depth. Opus security review: PASS.
3. **P-C (later):** JS component rendering via in-browser bundler (today: "component preview coming soon" notice + source); revisit fixture size + CSP.

## Links
- Part of: [[Claude REPL]]
