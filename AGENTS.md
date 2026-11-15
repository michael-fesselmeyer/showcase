<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Contribution rules

These rules apply to every change, whoever or whatever makes it, and to everything that reaches GitHub: commits, branch names, pull request and issue titles and bodies, comments, docs, code, test fixtures and seed data. `scripts/check-pr-hygiene.sh` checks some of them on every pull request.

## Write about the product

Describe this project as a product for its users: visitors to the studio's site and the studio's owner. Refer to "the owner", not to a named person. Do not write about who built it, why they built it, their plans, their schedule or how much time they have.

## Nothing personal, nothing real

- Never commit or post a real name, email address, phone number, home or business location, schedule or availability, or real email or inbox content.
- Never commit or post real business data: clients, leads, partners, rates, agreement terms, invoices, expenses, income or tax figures. This includes screenshots, test snapshots and examples in docs.
- Test and seed data are synthetic: `example.test` email addresses, invented people and invented companies.
- Values specific to the owner (rates, split terms, tax categories and parameters, jurisdiction details) are rows in the database, never constants, defaults or fixtures in the repository.

## The repository is public

Nothing may depend on the code being secret.

- Every private read and write is authorised on the server, next to the data, on every call. An unlinked or hard-to-guess URL is not a control.
- Business data lives only in the database and private file storage.
- Database dumps and backup files never enter the repository.

## Never leak a secret

Never commit, print or post a token, password, API key or connection string, including in CI logs, pull request text and screenshots. Real values live only in `.env.local`, which git ignores, and in the hosting provider's encrypted settings. `.env.example` lists variable names only. Never put a secret in a URL.

## No tool attribution

Do not add co-author trailers, "generated with" lines, or the names of AI tools or assistants to commit messages, branch names, pull request or issue text, comments or docs.

## Branches and commits

- Branch from the latest `main`. Name the branch `<type>/<slug>` or `<issue-number>-<slug>`, where the type is `feat`, `fix`, `chore`, `docs`, `test`, `ci`, `refactor` or `perf`.
- Keep the branch current by rebasing onto `main`. Never merge `main` into a branch.
- Write small Conventional Commits, one idea each: `type(scope): imperative summary`, with a short body when the reason is not obvious.
- Commit with the maintainer's GitHub no-reply email address.
- Never create empty or backdated commits, skip hooks, or force-push to `main`.

## Pull requests

- One pull request per issue, with `Closes #N`, what changed, why, and how it was tested.
- Merge by rebase only, after every check passes.

## Keep the docs current

A pull request updates the docs its change makes stale, in the same pull request:

- `README.md`: what the site does, configuration, environment variables, scripts and project structure.
- `docs/studio-tools/`: the data model for every schema change, the architecture for new routes, jobs or integrations, the security model for anything that changes who can reach what, and the roadmap when a phase's status changes.
- A new ADR in `docs/adr/` when the change makes a real decision with trade-offs.

Acceptance criteria in the roadmap and backlog change only when the plan changes, not to match what was built.

## Public pages stay static and fast

- Every route under `app/(site)` is static, enforced by `ensureStatic = 'navigation'` ([ADR 0003](docs/adr/0003-performance-budget.md), [ADR 0004](docs/adr/0004-private-area-beside-static-site.md)). A public page never reads cookies, headers or the query string on the server, and never queries the database at request time.
- Public code never imports from the private area or the database client.
- Lighthouse CI requires 95 or above in every category on mobile. A miss is a bug to fix in the same pull request. Never lower a threshold or turn an assertion into a warning.
- Every effect ships with a fallback that works before JavaScript loads and with reduced motion.

## Private pages are never shared

- Every data access function starts by establishing the caller with `requireOwner()` and filters by workspace.
- Server actions validate their input and are treated as public endpoints.
- Private data is never placed in a shared cache.

## Money and records

- Amounts are integer minor units with a currency code. No floating point arithmetic on money.
- Journal entries and audit events are append-only. Corrections are new entries.
- Tax, accounting and legal content is record keeping support, not advice. Say so wherever it appears.

## Free services only

- No feature may need a paid plan, a paid API key or a monthly bill without the owner's explicit approval.
- Stay inside each free tier. As usage nears a limit, the feature degrades gracefully instead of failing or costing money.
- Never add a provider without adding its free limit, with a link to the provider's own page, to [hosting and free tiers](docs/studio-tools/hosting-and-limits.md).
- Production infrastructure (databases, sign-in providers, storage, environment variables, domains) is created only with the owner's approval.

## Working in parallel

- One working copy per change, each with its own local database and its own dev server port.
- One schema change at a time: a pull request that adds a migration carries the `schema` label, and only one of them is ready for review at once.
- Rebase onto the latest `main` just before merging, and rerun the checks.

## Before every commit, push, pull request or issue edit

Check the diff and the text against these rules. If something that breaks them has already reached GitHub, stop and tell the maintainer before doing anything else. Do not rewrite history or force-push to fix it without asking.
