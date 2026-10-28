<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project conventions

See `README.md` for structure, server/client component rules, Redux and i18n conventions. Run `npm run check` before committing.

This repo lives in a workspace next to the backend (`../api`). The shared roadmap is `../PLAN.md` and the cross-repo workflow is in `../CLAUDE.md`: mark plan items `[~]` while in progress and `[x]` when done, and record new decisions there.
