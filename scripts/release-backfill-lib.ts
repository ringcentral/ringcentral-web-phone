/// <reference types="node" />

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export const GITHUB_OWNER = "ringcentral";
export const GITHUB_REPO = "ringcentral-web-phone";
export const GITHUB_API = "https://api.github.com";
export const BASELINE_VERSION = "2.0.0";

export type GitCommit = {
  date: string;
  message: string;
  sha: string;
  shortSha: string;
};

export type PackageSnapshot = GitCommit & {
  version?: string;
};

export type VersionChange = GitCommit & {
  previousVersion: string | null;
  version: string;
};

export type ExistingRemote = {
  releases: Set<string>;
  tags: Set<string>;
};

export type ReleaseTarget = VersionChange & {
  body: string;
  compareUrl: string;
  previousStableSha: string;
  previousStableVersion: string;
  relevantCommits: GitCommit[];
};

export type ReleaseConflict = {
  hasRelease: boolean;
  hasTag: boolean;
  version: string;
};

export type BackfillPlan = {
  baseline: VersionChange;
  conflicts: ReleaseConflict[];
  existing: VersionChange[];
  stableChanges: VersionChange[];
  targets: ReleaseTarget[];
};

export type CreatedRelease = {
  draft: boolean;
  html_url: string;
  tag_name: string;
};

export type GitHubRepository = {
  full_name: string;
  permissions?: {
    admin?: boolean;
    maintain?: boolean;
    push?: boolean;
  };
};

export type GitHubApi = {
  createRelease(input: {
    body: string;
    draft: boolean;
    name: string;
    prerelease: boolean;
    tag_name: string;
    target_commitish: string;
  }): Promise<CreatedRelease>;
  getCurrentUser(): Promise<{ login: string }>;
  getRepository(): Promise<GitHubRepository>;
  listReleaseTags(): Promise<Set<string>>;
  listTags(): Promise<Set<string>>;
};

export class GitHubApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
  }
}

export class GitHubRestApi implements GitHubApi {
  readonly #fetch: typeof fetch;
  readonly #token?: string;

  constructor(token?: string, fetchImplementation = fetch) {
    this.#token = token;
    this.#fetch = fetchImplementation;
  }

  async getCurrentUser() {
    return this.#requestJson<{ login: string }>("/user");
  }

  async getRepository() {
    return this.#requestJson<GitHubRepository>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}`,
    );
  }

  async listReleaseTags() {
    const releases = await this.#paginate<{ tag_name: string }>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases?per_page=100`,
    );
    return new Set(releases.map((release) => release.tag_name));
  }

  async listTags() {
    const tags = await this.#paginate<{ name: string }>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/tags?per_page=100`,
    );
    return new Set(tags.map((tag) => tag.name));
  }

  async createRelease(input: {
    body: string;
    draft: boolean;
    name: string;
    prerelease: boolean;
    tag_name: string;
    target_commitish: string;
  }) {
    return this.#requestJson<CreatedRelease>(
      `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases`,
      {
        body: JSON.stringify(input),
        method: "POST",
      },
    );
  }

  async #paginate<T>(path: string) {
    const items: T[] = [];
    let next: string | undefined = path;

    while (next) {
      const response = await this.#request<T[]>(next);
      items.push(...response.data);
      next = getNextLink(response.headers.get("link"));
    }

    return items;
  }

  async #requestJson<T>(path: string, init: RequestInit = {}) {
    return (await this.#request<T>(path, init)).data;
  }

  async #request<T>(path: string, init: RequestInit = {}) {
    const url = path.startsWith("http") ? path : `${GITHUB_API}${path}`;
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/vnd.github+json");
    headers.set("User-Agent", `${GITHUB_REPO}-release-backfill`);
    headers.set("X-GitHub-Api-Version", "2022-11-28");

    if (this.#token) {
      headers.set("Authorization", `Bearer ${this.#token}`);
    }

    const response = await this.#fetch(url, { ...init, headers });
    const text = await response.text();

    if (!response.ok) {
      throw new GitHubApiError(
        `${init.method ?? "GET"} ${url} failed with ${response.status}: ${text}`,
        response.status,
        text,
      );
    }

    return {
      data: text === "" ? (undefined as T) : (JSON.parse(text) as T),
      headers: response.headers,
    };
  }
}

export function collectVersionChanges(snapshots: PackageSnapshot[]) {
  const changes: VersionChange[] = [];
  let previousVersion: string | null = null;

  for (const snapshot of snapshots) {
    if (!snapshot.version || snapshot.version === previousVersion) {
      continue;
    }

    changes.push({
      date: snapshot.date,
      message: snapshot.message,
      previousVersion,
      sha: snapshot.sha,
      shortSha: snapshot.shortSha,
      version: snapshot.version,
    });
    previousVersion = snapshot.version;
  }

  return changes;
}

export function discoverVersionChanges(repoRoot: string) {
  const snapshots = parseGitLog(
    runGit(
      [
        "log",
        "--reverse",
        "--format=%H%x09%ad%x09%s",
        "--date=short",
        "--",
        "package.json",
      ],
      repoRoot,
    ),
  ).flatMap((commit) => {
    const packageJson = readPackageJsonAtCommit(repoRoot, commit.sha);
    if (!packageJson || typeof packageJson.version !== "string") {
      return [];
    }

    return [{ ...commit, version: packageJson.version }];
  });

  return collectVersionChanges(snapshots);
}

export function getCommitsBetween(
  repoRoot: string,
  previousSha: string,
  targetSha: string,
) {
  return parseGitLog(
    runGit(
      [
        "log",
        "--reverse",
        "--format=%H%x09%ad%x09%s",
        "--date=short",
        `${previousSha}..${targetSha}`,
      ],
      repoRoot,
    ),
  );
}

export function buildBackfillPlan(
  versionChanges: VersionChange[],
  existingRemote: ExistingRemote,
  getCommitsForTarget: (
    previousStable: VersionChange,
    change: VersionChange,
  ) => GitCommit[] = () => [],
): BackfillPlan {
  const stableChanges = versionChanges.filter((change) =>
    isStable2xVersion(change.version),
  );
  const baselineIndex = stableChanges.findIndex(
    (change) => change.version === BASELINE_VERSION,
  );

  if (baselineIndex === -1) {
    throw new Error(`Missing stable baseline version ${BASELINE_VERSION}.`);
  }

  const baseline = stableChanges[baselineIndex];
  const conflicts: ReleaseConflict[] = [];
  const existing: VersionChange[] = [];
  const targets: ReleaseTarget[] = [];

  for (
    let index = baselineIndex + 1;
    index < stableChanges.length;
    index += 1
  ) {
    const change = stableChanges[index];
    const hasTag = existingRemote.tags.has(change.version);
    const hasRelease = existingRemote.releases.has(change.version);

    if (hasTag && hasRelease) {
      existing.push(change);
      continue;
    }

    if (hasTag || hasRelease) {
      conflicts.push({ hasRelease, hasTag, version: change.version });
      continue;
    }

    const previousStable = stableChanges[index - 1];
    targets.push(
      buildReleaseTarget(
        change,
        previousStable,
        getCommitsForTarget(previousStable, change),
      ),
    );
  }

  return { baseline, conflicts, existing, stableChanges, targets };
}

export function buildReleaseTarget(
  change: VersionChange,
  previousStable: VersionChange,
  commits: GitCommit[],
): ReleaseTarget {
  const notes = buildReleaseNotes(
    change.version,
    previousStable.version,
    commits,
  );

  return {
    ...change,
    body: notes.body,
    compareUrl: notes.compareUrl,
    previousStableSha: previousStable.sha,
    previousStableVersion: previousStable.version,
    relevantCommits: notes.relevantCommits,
  };
}

export function buildReleaseNotes(
  version: string,
  previousVersion: string,
  commits: GitCommit[],
) {
  const compareUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/compare/${previousVersion}...${version}`;
  const relevantCommits = commits.filter(
    (commit) => !isChoreCommit(commit.message),
  );
  const body =
    relevantCommits.length === 0
      ? `Maintenance release.\n\n**Full Changelog**: ${compareUrl}`
      : `## What's Changed\n${relevantCommits
          .map((commit) => `- ${commit.message} (${commit.shortSha})`)
          .join("\n")}\n\n**Full Changelog**: ${compareUrl}`;

  return { body, compareUrl, relevantCommits };
}

export function isStable2xVersion(version: string) {
  return /^2\.\d+\.\d+$/.test(version);
}

export function isChoreCommit(message: string) {
  const normalized = message.trim();

  return [
    /^release(?:\s+v?\d+\.\d+\.\d+(?:[-.][0-9A-Za-z.-]+)?)?$/i,
    /^release new version$/i,
    /^upgrade dependencies(?:\b.*)?$/i,
    /\b(?:deno\s+)?fmt\b/i,
    /\bformat(?:ting)?\b/i,
    /\blint\b/i,
    /\btests?\b/i,
    /^format(?: and lint)?$/i,
    /^fix test(?: case|s)?$/i,
    /^replace yarn with pnpm$/i,
    /^make wait-for-async devDep$/i,
    /^no more eslint and prettier$/i,
    /^use biome to format code$/i,
    /^update todo list$/i,
  ].some((pattern) => pattern.test(normalized));
}

export async function fetchExistingRemote(api: GitHubApi) {
  const [tags, releases] = await Promise.all([
    api.listTags(),
    api.listReleaseTags(),
  ]);
  return { releases, tags };
}

export async function applyBackfill(api: GitHubApi, plan: BackfillPlan) {
  await preflightWrite(api, plan);
  return createDraftReleases(api, plan.targets);
}

export async function preflightWrite(api: GitHubApi, plan: BackfillPlan) {
  if (plan.conflicts.length > 0) {
    throw new Error(formatConflicts(plan.conflicts));
  }

  if (plan.targets.length === 0) {
    throw new Error("No missing stable 2.x releases to create.");
  }

  const [user, repository] = await Promise.all([
    api.getCurrentUser(),
    api.getRepository(),
  ]);
  const permissions = repository.permissions;

  if (
    permissions &&
    !permissions.admin &&
    !permissions.maintain &&
    !permissions.push
  ) {
    throw new Error(
      `${user.login} does not have push/admin access to ${repository.full_name}.`,
    );
  }

  return { repository, user };
}

export async function createDraftReleases(
  api: GitHubApi,
  targets: ReleaseTarget[],
) {
  const releases: CreatedRelease[] = [];

  for (const target of targets) {
    try {
      releases.push(
        await api.createRelease({
          body: target.body,
          draft: true,
          name: target.version,
          prerelease: false,
          tag_name: target.version,
          target_commitish: target.sha,
        }),
      );
    } catch (error) {
      if (error instanceof GitHubApiError && error.status === 403) {
        throw new Error(
          `GitHub rejected release ${target.version}. Make sure GITHUB_TOKEN has Contents: Read and write for ${GITHUB_OWNER}/${GITHUB_REPO}.`,
        );
      }
      throw error;
    }
  }

  return releases;
}

export function formatPlan(plan: BackfillPlan) {
  const lines = [
    `Stable 2.x version changes: ${plan.stableChanges.length}`,
    `Existing stable 2.x releases after ${BASELINE_VERSION}: ${plan.existing.length}`,
    `Missing stable 2.x releases to create: ${plan.targets.length}`,
  ];

  if (plan.conflicts.length > 0) {
    lines.push("", formatConflicts(plan.conflicts));
  }

  for (const target of plan.targets) {
    const summary =
      target.relevantCommits.length === 0
        ? "maintenance"
        : `${target.relevantCommits.length} change(s)`;
    lines.push(
      "",
      `## ${target.version} (${target.shortSha}, ${summary})`,
      target.body,
    );
  }

  return lines.join("\n");
}

export function formatConflicts(conflicts: ReleaseConflict[]) {
  return [
    "Found versions with a tag/release conflict:",
    ...conflicts.map((conflict) => {
      const parts = [
        conflict.hasTag ? "tag exists" : "tag missing",
        conflict.hasRelease ? "release exists" : "release missing",
      ];
      return `- ${conflict.version}: ${parts.join(", ")}`;
    }),
  ].join("\n");
}

export function readGitHubToken(repoRoot: string) {
  if (process.env.GITHUB_TOKEN) {
    return process.env.GITHUB_TOKEN;
  }

  return readEnv(resolve(repoRoot, ".env")).GITHUB_TOKEN;
}

function readEnv(path: string) {
  const values: Record<string, string> = {};

  if (!existsSync(path)) {
    return values;
  }

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) {
      continue;
    }

    const separator = trimmed.indexOf("=");
    if (separator === -1) {
      continue;
    }

    const name = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    values[name] = unquote(value);
  }

  return values;
}

function unquote(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseGitLog(output: string): GitCommit[] {
  return output
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [sha, date, ...messageParts] = line.split("\t");
      return {
        date,
        message: messageParts.join("\t"),
        sha,
        shortSha: sha.slice(0, 12),
      };
    });
}

function readPackageJsonAtCommit(repoRoot: string, sha: string) {
  try {
    return JSON.parse(runGit(["show", `${sha}:package.json`], repoRoot)) as {
      version?: unknown;
    };
  } catch {
    return undefined;
  }
}

function runGit(args: string[], repoRoot: string) {
  return execFileSync("git", args, { cwd: repoRoot, encoding: "utf8" });
}

function getNextLink(linkHeader: string | null) {
  return linkHeader?.match(/<([^>]+)>;\s*rel="next"/)?.[1];
}
