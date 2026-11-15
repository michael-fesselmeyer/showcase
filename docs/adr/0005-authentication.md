# ADR 0005: Authentication for the private area

- Status: accepted
- Date: 2026-11-15

## Context

The private area has one user, the owner, and holds other people's contact details and financial
records. The repository is public, so the sign-in flow is fully visible to anyone. Services must
be free. A read-only partner role may come later.

## Decision

- **Better Auth, running in this app, storing users and sessions in the app's own Postgres
  database.** No separate identity service.
- **Two sign-in methods and no password:**
  - GitHub OAuth, accepted only for the account whose numeric id is in `STUDIO_OWNER_GITHUB_ID`.
    A database hook rejects the creation of any other user.
  - Passkeys (WebAuthn), which can only be registered from an existing session.
- **Sessions are database rows** referenced by an `HttpOnly`, `Secure`, `SameSite=Lax` cookie.
- **Authentication only proves identity.** What a signed-in user may do is decided by the
  `membership` role, checked in the data access layer on every call
  ([security model](../studio-tools/security.md)).
- **Sensitive actions require a recent verification** (step-up).

## Alternatives considered

- **A hosted identity service (for example Clerk or Auth0):** less code and a polished interface,
  free at this scale. But it adds a third party that holds the identity data and a dependency on
  its free plan, for a tool with exactly one user.
- **The hosting platform's own deployment protection:** protects a whole deployment, not one
  path, and the public site must stay open.
- **Email and password with an authenticator app:** works without GitHub, but adds a password to
  store, a reset flow to build and secure, and a phishable secret.
- **Email magic links:** needs an email provider from the first day, and is only as strong as the
  mailbox.
- **Hand-written sessions and WebAuthn:** small in principle, but authentication is where subtle
  mistakes are costly. A maintained library is the safer choice.
- **Stateless tokens (JWT) instead of session rows:** saves a lookup per request, but a token
  cannot be revoked before it expires.

## Consequences

- No password exists to leak, reuse or phish. Passkeys are bound to the site's domain.
- Losing access to GitHub does not lock the owner out (a passkey still works), and the reverse.
- Passkeys and the OAuth callback are tied to the domain. Moving to a custom domain means
  registering passkeys again and updating the OAuth application, so the domain should be settled
  before production sign-in is set up.
- Preview deployments cannot sign anyone in (their domains differ), which is intended.
- Session lookups add one indexed query to each private request.
- The security of the owner's GitHub account becomes part of the system; two-factor authentication
  on it is on the launch checklist.
