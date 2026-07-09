/// <reference types="node" />

import assert from "node:assert/strict";
import test from "node:test";
import {
  applyBackfill,
  buildBackfillPlan,
  buildReleaseNotes,
  collectVersionChanges,
  discoverVersionChanges,
  type GitHubApi,
  GitHubApiError,
  type GitHubRepository,
} from "./release-backfill-lib.js";

test("discovers stable 2.x backfill targets and skips prereleases/gaps", () => {
  const changes = collectVersionChanges([
    snapshot("a", "0.1.0", "Initial commit"),
    snapshot("b", "2.0.0-beta.1", "Release beta"),
    snapshot("c", "2.0.0", "Release 2.0.0"),
    snapshot("d", "2.0.1", "Fix one"),
    snapshot("e", "2.1.0-beta.1", "Beta"),
    snapshot("f", "2.1.0", "Release 2.1.0"),
    snapshot("g", "2.1.3", "Skipped 2.1.2 on purpose"),
  ]);

  const plan = buildBackfillPlan(changes, existing(["2.0.0"], ["2.0.0"]));

  assert.deepEqual(
    plan.targets.map((target) => target.version),
    ["2.0.1", "2.1.0", "2.1.3"],
  );
});

test("skips existing releases and continues at the next missing version", () => {
  const changes = collectVersionChanges([
    snapshot("a", "2.0.0", "Release 2.0.0"),
    snapshot("b", "2.1.5", "Release 2.1.5"),
    snapshot("c", "2.1.6", "Release 2.1.6"),
    snapshot("d", "2.1.7", "Release 2.1.7"),
  ]);
  const plan = buildBackfillPlan(
    changes,
    existing(["2.0.0", "2.1.5", "2.1.6"], ["2.0.0", "2.1.5", "2.1.6"]),
  );

  assert.deepEqual(
    plan.existing.map((change) => change.version),
    ["2.1.5", "2.1.6"],
  );
  assert.deepEqual(
    plan.targets.map((target) => target.version),
    ["2.1.7"],
  );
});

test("filters chore commits and falls back to maintenance release notes", () => {
  const notes = buildReleaseNotes("2.4.4", "2.4.3", [
    commit("a", "Upgrade dependencies"),
    commit("b", "Release 2.4.4"),
    commit("d", "Fix some lint issues"),
    commit("e", "Add a test case for custom headers"),
    commit("c", "Make SipClient type simplier"),
  ]);

  assert.equal(notes.relevantCommits.length, 1);
  assert.match(notes.body, /Make SipClient type simplier/);
  assert.doesNotMatch(notes.body, /Upgrade dependencies/);
  assert.doesNotMatch(notes.body, /Release 2\.4\.4/);
  assert.doesNotMatch(notes.body, /Fix some lint issues/);
  assert.doesNotMatch(notes.body, /Add a test case/);

  const fallback = buildReleaseNotes("2.0.7", "2.0.6", [
    commit("d", "Release 2.0.7"),
  ]);

  assert.equal(fallback.relevantCommits.length, 0);
  assert.match(fallback.body, /^Maintenance release\./);
});

test("current repository dry-run has exactly 45 missing stable releases", () => {
  const changes = discoverVersionChanges(process.cwd());
  const plan = buildBackfillPlan(changes, existing(["2.0.0"], ["2.0.0"]));

  assert.equal(plan.targets.length, 45);
  assert.equal(plan.targets[0]?.version, "2.0.1");
  assert.equal(plan.targets.at(-1)?.version, "2.4.4");
});

test("apply preflights repository access and publishes releases", async () => {
  const api = new FakeGitHubApi();
  const plan = buildBackfillPlan(
    collectVersionChanges([
      snapshot("a", "2.0.0", "Release 2.0.0"),
      snapshot("b", "2.0.1", "Fix one"),
    ]),
    existing(["2.0.0"], ["2.0.0"]),
  );

  await applyBackfill(api, plan);

  assert.equal(api.preflighted, true);
  assert.deepEqual(api.created, [
    {
      draft: false,
      name: "2.0.1",
      prerelease: false,
      tag_name: "2.0.1",
      target_commitish: "b",
    },
  ]);
});

test("apply reports progress after each published release", async () => {
  const api = new FakeGitHubApi();
  const events: string[] = [];
  const plan = buildBackfillPlan(
    collectVersionChanges([
      snapshot("a", "2.0.0", "Release 2.0.0"),
      snapshot("b", "2.0.1", "Fix one"),
      snapshot("c", "2.0.2", "Fix two"),
      snapshot("d", "2.0.3", "Fix three"),
    ]),
    existing(["2.0.0"], ["2.0.0"]),
  );

  await applyBackfill(api, plan, {
    onPublished: ({ index, release, total }) =>
      events.push(`published ${index}/${total} ${release.tag_name}`),
  });

  assert.deepEqual(events, [
    "published 1/3 2.0.1",
    "published 2/3 2.0.2",
    "published 3/3 2.0.3",
  ]);
});

test("apply fails before writes when a target has a tag/release conflict", async () => {
  const api = new FakeGitHubApi();
  const plan = buildBackfillPlan(
    collectVersionChanges([
      snapshot("a", "2.0.0", "Release 2.0.0"),
      snapshot("b", "2.0.1", "Fix one"),
    ]),
    existing(["2.0.0", "2.0.1"], ["2.0.0"]),
  );

  await assert.rejects(() => applyBackfill(api, plan), /tag\/release conflict/);
  assert.equal(api.created.length, 0);
});

test("publish failure includes GitHub 403 body and diagnostic headers", async () => {
  const api = new FakeGitHubApi(
    new GitHubApiError(
      "POST failed",
      403,
      JSON.stringify({
        documentation_url:
          "https://docs.github.com/rest/using-the-rest-api/rate-limits-for-the-rest-api",
        message: "You have exceeded a secondary rate limit.",
      }),
      new Headers({
        "retry-after": "60",
        "x-github-request-id": "ABC:123",
        "x-ratelimit-remaining": "0",
      }),
    ),
  );

  await assert.rejects(
    () => applyBackfill(api, singleTargetPlan()),
    (error) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /release 2\.0\.1/);
      assert.match(error.message, /HTTP 403/);
      assert.match(error.message, /secondary rate limit/);
      assert.match(error.message, /retry-after: 60/);
      assert.match(error.message, /x-ratelimit-remaining: 0/);
      assert.match(error.message, /x-github-request-id: ABC:123/);
      assert.match(error.message, /Contents: Read and write/);
      return true;
    },
  );
});

test("publish failure includes GitHub 429 body and retry headers", async () => {
  const api = new FakeGitHubApi(
    new GitHubApiError(
      "POST failed",
      429,
      JSON.stringify({ message: "API rate limit exceeded." }),
      new Headers({
        "retry-after": "30",
        "x-ratelimit-reset": "1783638000",
      }),
    ),
  );

  await assert.rejects(
    () => applyBackfill(api, singleTargetPlan()),
    (error) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /HTTP 429/);
      assert.match(error.message, /API rate limit exceeded/);
      assert.match(error.message, /retry-after: 30/);
      assert.match(error.message, /x-ratelimit-reset: 1783638000/);
      assert.doesNotMatch(error.message, /Contents: Read and write/);
      return true;
    },
  );
});

class FakeGitHubApi implements GitHubApi {
  created: Array<{
    draft: boolean;
    name: string;
    prerelease: boolean;
    tag_name: string;
    target_commitish: string;
  }> = [];
  preflighted = false;

  constructor(readonly failure?: Error) {}

  async getCurrentUser() {
    this.preflighted = true;
    return { login: "tylerlong" };
  }

  async getRepository(): Promise<GitHubRepository> {
    return {
      full_name: "ringcentral/ringcentral-web-phone",
      permissions: { admin: true },
    };
  }

  async listReleaseTags() {
    return new Set<string>();
  }

  async listTags() {
    return new Set<string>();
  }

  async createRelease(input: ReleaseTargetInput) {
    if (this.failure) {
      throw this.failure;
    }

    this.created.push({
      draft: input.draft,
      name: input.name,
      prerelease: input.prerelease,
      tag_name: input.tag_name,
      target_commitish: input.target_commitish,
    });

    return {
      draft: input.draft,
      html_url: `https://github.com/ringcentral/ringcentral-web-phone/releases/tag/${input.tag_name}`,
      tag_name: input.tag_name,
    };
  }
}

type ReleaseTargetInput = Parameters<GitHubApi["createRelease"]>[0];

function singleTargetPlan() {
  return buildBackfillPlan(
    collectVersionChanges([
      snapshot("a", "2.0.0", "Release 2.0.0"),
      snapshot("b", "2.0.1", "Fix one"),
    ]),
    existing(["2.0.0"], ["2.0.0"]),
  );
}

function existing(tags: string[], releases: string[]) {
  return { releases: new Set(releases), tags: new Set(tags) };
}

function snapshot(sha: string, version: string, message: string) {
  return { ...commit(sha, message), version };
}

function commit(sha: string, message: string) {
  return {
    date: "2026-01-01",
    message,
    sha,
    shortSha: sha.slice(0, 12),
  };
}
