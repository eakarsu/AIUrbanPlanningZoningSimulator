# Governed Zoning Operations

The supported backend is `/api/governed-zoning`. Original generated, direct-AI, public permit, broad simulation, and `gap*` routes remain as prototype reference material but are not mounted by `server/index.js`.

## Controlled setup

1. Copy `.env.example` into a secret-managed runtime and replace placeholders.
2. Run `./scripts/bootstrap.sh` explicitly to install lockfile-pinned dependencies.
3. Apply `./scripts/migrate.sh apply-governed-zoning-001` through normal database change approval.
4. Provision tenant/matter roles and qualified-reviewer records through an administrator-controlled channel. Public registration is disabled.
5. Enable providers only after their HTTPS endpoint and runtime credential are configured and contract tested. TLS certificate verification and provider readiness fail closed.
6. Run `./start.sh`. It refuses missing dependencies and occupied ports and does not install, seed, create/migrate databases, start system services, or terminate processes it did not start.

## Matter workflow

Matter intake binds an owner, jurisdiction, as-of date, retention date, and optional legal hold. Sources require trusted registry references, content/signature digests, effective dates, authority rank, classification, and privilege basis. Jurisdiction mismatch is rejected; conflicting versions require an attested qualified resolution.

Zoning analysis deterministically calculates FAR, height, units per acre, and setback from an authoritative GIS digest and the resolved rule set. Findings retain rule and GIS evidence and are informational, not permit predictions or legal advice. Privileged/confidential sources are redacted based on matter role. Copilot messages are durable, cite only visible effective sources, carry the analysis digest and non-advice notice, and abstain when no authorized evidence exists.

Independent qualified review and a cited deadline are required before approval. Filing requires identity, e-signature, and filing providers, an immutable document digest, an idempotent outbox, and a signed replayable delivery receipt. Failures retry to a dead-letter ceiling. Sources, resolutions, analyses, deadlines, copilot messages, approvals, deliveries, and audit events are append-only; legal holds cannot be cleared by ordinary update.

## External validation still required

Local tests cover jurisdiction/effective dates, source conflicts, privilege/redaction, adverse calculations, deadlines, copilot abstention/citations, dual review, receipts, migration, API, TLS, and launcher contracts without external services. Production release still requires municipal counsel/planning review, official registry/GIS/matter/document/identity/e-sign/filing contract tests, reviewed jurisdiction fixtures, controlled migration/restore rehearsal, retention/hold procedures, security review, and end-to-end filing sandbox validation.
