#!/usr/bin/env tsx
/// <reference types="node" />

import {
  applyBackfill,
  buildBackfillPlan,
  discoverVersionChanges,
  fetchExistingRemote,
  formatPlan,
  GitHubRestApi,
  getCommitsBetween,
  readGitHubToken,
} from "./release-backfill-lib.js";

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const apply = process.argv.includes("--apply");
  const repoRoot = process.cwd();
  const token = readGitHubToken(repoRoot);

  if (apply && !token) {
    throw new Error(
      "Missing GITHUB_TOKEN. Add it to the repo .env before running with --apply.",
    );
  }

  const api = new GitHubRestApi(token);
  const existingRemote = await fetchExistingRemote(api);
  const versionChanges = discoverVersionChanges(repoRoot);
  const plan = buildBackfillPlan(
    versionChanges,
    existingRemote,
    (previousStable, change) =>
      getCommitsBetween(repoRoot, previousStable.sha, change.sha),
  );

  console.log(formatPlan(plan));

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to publish releases.");
    return;
  }

  const releases = await applyBackfill(api, plan);
  console.log("\nPublished releases:");
  for (const release of releases) {
    console.log(`- ${release.tag_name}: ${release.html_url}`);
  }
}
