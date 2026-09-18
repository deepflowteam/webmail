# Webmail Workspace Guide

Public AGPL Webmail product for customer-owned Cloudflare infrastructure.

Always write in Simplified Technical English (ASD-STE100) and follow Zinsser's four principles of
quality writing: Simplicity, Brevity, Clarity, Humanity.

Read `../hqbase-site/src/content/docs/docs/maintainers/documentation.md` before changing product
behavior or working across Webmail repositories.

## Boundaries

- Keep one public product identity and signed Stable and opt-in Nightly release channels.
- Keep public distribution direct from the canonical `Webmail/hqbase` repository.
- Record every schema change as a migration with fresh-install and update tests.
- Keep customer mail and Cloudflare credentials in customer infrastructure.
- Never log credentials or mail content.
- Never mutate Cloudflare resources outside `.hqbase/deployments/<name>/manifest.json`.
- Update the relevant canonical specification in
  `../hqbase-site/src/content/docs/docs/specs/` before implementation.
- Identify every affected repository, run each local gate, and keep code, tests, specifications,
  and public documentation consistent.
- Run Webmail staging E2E when behavior crosses deployed systems.
- Do not declare completion while code, tests, specifications, or supported products disagree.

Repository-local `AGENTS.md` and `CONTRIBUTING.md` files define commands and safety rules for each
checkout.

## Quality gate

```sh
bun run check
bun run deploy:dry-run
```

Run `bun run cf:typegen` after changing `wrangler.jsonc`. The documentation integrity gate belongs to
`hqbase-site`; Webmail owns its staging E2E gate.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
