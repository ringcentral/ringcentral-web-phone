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

test("apply preflights repository access and creates draft releases", async () => {
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
      draft: true,
      name: "2.0.1",
      prerelease: false,
      tag_name: "2.0.1",
      target_commitish: "b",
    },
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

class FakeGitHubApi implements GitHubApi {
  created: Array<{
    draft: boolean;
    name: string;
    prerelease: boolean;
    tag_name: string;
    target_commitish: string;
  }> = [];
  preflighted = false;

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
