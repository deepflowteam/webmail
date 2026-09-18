import { requireString } from "./args.mjs";
import { run } from "./command.mjs";
import { configPath, loadManifest } from "./manifest.mjs";

export function doctor(flags) {
  const name = requireString(flags, "name");
  const manifest = loadManifest(name);
  const options = manifest.accountId ? { env: { CLOUDFLARE_ACCOUNT_ID: manifest.accountId } } : {};

  run("bun", ["x", "wrangler", "deploy", "--dry-run", "--config", configPath(name)], options);
  run(
    "bun",
    ["x", "wrangler", "d1", "info", manifest.d1.name, "--config", configPath(name)],
    options
  );
  run(
    "bun",
    [
      "x",
      "wrangler",
      "d1",
      "execute",
      manifest.d1.name,
      "--remote",
      "--command",
      "SELECT value FROM hqbase_schema_state WHERE key = 'product'; SELECT product, installed_version, installed_schema_version FROM release_state WHERE singleton = 1;",
      "--config",
      configPath(name)
    ],
    options
  );
  run("bun", ["x", "wrangler", "r2", "bucket", "info", manifest.r2.bucket, "--json"], options);
  if (manifest.queue) {
    const primary = manifest.queue.primary?.name ?? manifest.queue.name;
    const deadLetter = manifest.queue.deadLetter?.name ?? manifest.queue.deadLetterName;
    run("bun", ["x", "wrangler", "queues", "info", primary], options);
    run("bun", ["x", "wrangler", "queues", "info", deadLetter], options);
  }
  run(
    "bun",
    ["x", "wrangler", "deployments", "status", "--name", manifest.worker.name, "--json"],
    options
  );

  if (manifest.email?.domain) {
    run("bun", ["x", "wrangler", "email", "routing", "settings", manifest.email.domain], {
      ...options,
      allowFailure: true
    });
    run("bun", ["x", "wrangler", "email", "sending", "settings", manifest.email.domain], {
      ...options,
      allowFailure: true
    });
  }
}
