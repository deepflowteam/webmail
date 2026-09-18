#!/usr/bin/env node
// Deploys the local HEAD worker source straight to a managed .hqbase/deployments/<name>
// installation, using a Cloudflare account alias from ~/.config/cloudflare/accounts.json
// (the same file cf.zsh reads).
//
// This exists because scripts/release/deploy.mjs always downloads and builds the signed
// GitHub release artifact, even for --configuration-only. When local HEAD is ahead of the
// latest signed release (newer migrations, newer Durable Objects, etc.) that pipeline fails
// to bundle correctly and there is no way to point it at local source without a valid release
// signature. This script bypasses it entirely: build local HEAD, `wrangler deploy` it with a
// release tag that matches the currently configured product release identity (see
// config/product.json / scripts/release/manifest.mjs hqbaseReleaseTag), so any later
// `bun run hqbase domain` / update tooling that inspects the active release tag still sees a
// consistent value instead of tripping the "not the signed stable release" guard again.
//
// Usage:
//   node scripts/dex-deploy.mjs <deployment-name> [account-alias]
//   node scripts/dex-deploy.mjs guestboxer-mail          # account alias defaults to "dex"
//   node scripts/dex-deploy.mjs guestboxer-mail dex --skip-migrate
//   node scripts/dex-deploy.mjs guestboxer-mail dex --stamp-version
//   node scripts/dex-deploy.mjs guestboxer-mail dex --stamp-version=1.4.2-dev
//
// Both D1 migration phases are applied to the remote database automatically after every deploy.
//
// Flags:
//   --skip-migrate         don't apply pending D1 migrations after deploying
//   --skip-build           skip `bun run build` (reuse the existing dist/)
//   --stamp-version[=X]    set the deployed HQBASE_APP_VERSION var to X (defaults to the local
//                          package.json version). Without this flag, --keep-vars leaves whatever
//                          HQBASE_APP_VERSION was written by the last "hqbase:install"/signed
//                          update in place, so the in-app update checker keeps comparing against
//                          that stale version instead of what this script actually deployed.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { applyMigrationPhase } from "./d1-migrations.mjs";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const positionals = args.filter((arg) => !arg.startsWith("--"));
const flags = new Set(args.filter((arg) => arg.startsWith("--")));

const deploymentName = positionals[0];
const accountAlias = positionals[1] ?? "dex";

if (!deploymentName) {
  console.error(
    "Usage: node scripts/dex-deploy.mjs <deployment-name> [account-alias] [--skip-migrate] [--skip-build] [--stamp-version[=X]]"
  );
  process.exit(1);
}

const stampVersionFlag = args.find(
  (arg) => arg === "--stamp-version" || arg.startsWith("--stamp-version=")
);
let stampVersion;
if (stampVersionFlag) {
  const eqIndex = stampVersionFlag.indexOf("=");
  stampVersion = eqIndex === -1 ? undefined : stampVersionFlag.slice(eqIndex + 1);
  if (!stampVersion) {
    const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8"));
    stampVersion = pkg.version;
  }
}

const configPath = resolve(root, ".hqbase/deployments", deploymentName, "wrangler.jsonc");
if (!existsSync(configPath)) {
  console.error(
    `No deployment config at ${configPath}. Run "bun run hqbase:install --name ${deploymentName} ..." first.`
  );
  process.exit(1);
}

const config = JSON.parse(
  readFileSync(configPath, "utf8").replace(/\/\/.*$/gm, "") // strip // comments (jsonc)
);
const workerName = config.name;
if (!workerName) {
  console.error(`${configPath} has no "name".`);
  process.exit(1);
}

const accountsFile =
  process.env.CF_ACCOUNTS_FILE ??
  resolve(process.env.HOME ?? "", ".config/cloudflare/accounts.json");
if (!existsSync(accountsFile)) {
  console.error(`Missing Cloudflare accounts file: ${accountsFile}`);
  process.exit(1);
}
const accounts = JSON.parse(readFileSync(accountsFile, "utf8"));
const account = accounts.accounts?.[accountAlias];
if (!account) {
  console.error(`Unknown account alias "${accountAlias}" in ${accountsFile}.`);
  process.exit(1);
}
const apiToken =
  account.api_token ?? (account.api_token_env ? process.env[account.api_token_env] : undefined);
if (!apiToken) {
  console.error(
    `No usable token for account alias "${accountAlias}" (checked api_token / api_token_env).`
  );
  process.exit(1);
}

const env = {
  ...process.env,
  CLOUDFLARE_API_TOKEN: apiToken,
  CLOUDFLARE_ACCOUNT_ID: account.account_id
};

function run(cmd, cmdArgs, options = {}) {
  console.log(`$ ${cmd} ${cmdArgs.join(" ")}`);
  execFileSync(cmd, cmdArgs, { cwd: root, env, stdio: "inherit", ...options });
}

// Matches config/product.json's version + the artifact sha256 of the latest signed GitHub
// release at the time this script was written. Only the release tooling's own comparisons
// care about this value; it has no effect on what code actually gets bundled and deployed.
const RELEASE_TAG = "hqbase:1.2.0:8540e12cc396f1f9497aa93f5994cbe8440bb5b22f8b044b6b829b0c0743f2d2";

if (!flags.has("--skip-build")) {
  run("bun", ["run", "build"]);
}

const varArgs = ["--var", `HQBASE_WORKER_NAME:${workerName}`];
if (stampVersion) varArgs.push("--var", `HQBASE_APP_VERSION:${stampVersion}`);

run("./node_modules/.bin/wrangler", [
  "deploy",
  "--config",
  configPath,
  "--keep-vars",
  ...varArgs,
  "--tag",
  RELEASE_TAG
]);

if (stampVersion) {
  console.log(`Stamped HQBASE_APP_VERSION as "${stampVersion}".`);
}

if (!flags.has("--skip-migrate")) {
  const migrationOptions = {
    configFile: configPath,
    run: (command, commandArgs, cwd) => run(command, commandArgs, { cwd }),
    target: "remote"
  };
  applyMigrationPhase(root, "normal", migrationOptions);
  applyMigrationPhase(root, "after-deploy", migrationOptions);
}

console.log(
  `\nDeployed "${workerName}" to Cloudflare account "${accountAlias}" (${account.account_id}).`
);
