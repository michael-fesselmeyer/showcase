# ADR 0009: Private file storage

- Status: accepted
- Date: 2026-11-15

## Context

From Release 2 the tool keeps receipts, and from Release 3 signed agreements. These are private
and some must be kept for years. The hosting platform limits a request body to a few megabytes,
the service must be free, and the repository is public, so no file may ever be reachable by
guessing a URL.

## Decision

- **Vercel Blob, in a private store,** for the bytes. **The database holds the metadata:** a
  random storage key, a SHA-256 hash, size, media type, what the file is and what it is attached
  to.
- **A small `FileStore` interface** (`put`, `get`, `delete`) wraps the storage service, with an
  in-memory implementation for tests. The provider can be replaced without touching features.
- **Uploads go from the browser straight to storage** using a short-lived token that the server
  issues only to a signed-in owner, so large files never pass through a function.
- **Downloads go through an authorised route** that checks the session and the workspace, then
  streams the file with `Content-Disposition: attachment`. No public or long-lived URL exists.
- **Uploads are restricted:** PDF, PNG, JPEG and WebP only, verified from the file's first bytes
  and not its name or declared type; 10 MB at most; images downscaled in the browser first.
- **Storage keys are random.** The original file name is kept in the database, never in the key.
- **The tool tracks its own usage** from the `file` table: it warns at 70% of the free storage
  limit and refuses new uploads at 90%, because exceeding the limit blocks the store for 30 days.
- **Retention:** a file can carry a `retain_until` date and is deleted only when nothing links to
  it and that date has passed.

## Alternatives considered

- **Files in Postgres (`bytea`):** one service, and backups would include files. But the database
  is limited to 1 GB in total, and receipts would crowd out the records.
- **Cloudflare R2 or Backblaze B2:** larger free allowances (around 10 GB). Each means another
  account and set of credentials. They are the planned replacements if the storage limit or a
  change of host makes Blob unsuitable, which is why the adapter exists.
- **Public storage with unguessable URLs:** simple, and common. It is security through obscurity:
  a URL that leaks once (a log, a browser history, a forwarded email) exposes the file for good.
- **Proxying uploads through a server action:** simpler code, but capped by the request size limit
  and it spends function time on moving bytes.
- **Encrypting each file in the application before upload:** protects against the storage
  provider, at the cost of key management and no direct uploads. Deferred: the most sensitive
  documents (anything with a tax identification or bank number) are not stored at all.

## Consequences

- No file is reachable without a valid session, and every download can be audited.
- The free allowance (1 GB, a limited number of operations a month) is small. Downscaling images
  and tracking usage in the database keep the tool well inside it; the limits are recorded in
  [hosting and free tiers](../studio-tools/hosting-and-limits.md).
- The hash allows integrity checks and spotting a receipt uploaded twice.
- Encrypted database backups are stored here too, so a failure of the database provider does not
  take the backups with it.
- Files are not part of the database backup; the monthly owner-held copy covers both.
