# Scripts

## `release-backfill.ts`

Backfills missing GitHub releases for stable `2.x` package versions.

The script scans `package.json` history, finds stable `2.x` version bumps after
`2.0.0`, skips prereleases, builds release notes from the commits between stable
versions, and checks GitHub for existing tags/releases before writing anything.

Run a dry run:

```sh
pnpm release:backfill
```

Publish the missing releases:

```sh
pnpm release:backfill --apply
```

`--apply` publishes real GitHub releases immediately. It does not create drafts.
After each successful publish, the script prints progress.

For `--apply`, provide `GITHUB_TOKEN` through the shell environment or the local
private `.env` file. The token needs access to `ringcentral/ringcentral-web-phone`
with repository `Contents` set to read/write. Do not commit tokens.

## `release-backfill-lib.ts`

Shared implementation for release discovery, release-note generation, GitHub REST
calls, and write preflight checks.

## `release-backfill.test.ts`

Focused Node test coverage for the backfill script:

- stable version discovery and prerelease skipping
- release-note curation and maintenance fallback
- current repository target count
- rerun behavior for already-created releases
- publish progress
- write preflight behavior
- conflict handling before any release is published
- GitHub REST failure diagnostics
