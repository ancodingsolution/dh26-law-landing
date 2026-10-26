import { spawn } from "node:child_process";
import { once } from "node:events";

async function run(args, env) {
  const child = spawn(process.execPath, args, { env, stdio: "inherit" });
  const [code] = await once(child, "exit");
  if (code !== 0) throw new Error(`Command failed with exit ${code}: ${args[0]}`);
}
const original = { ...process.env };
const fixture = { ...original, NEXT_PUBLIC_TURNSTILE_SITE_KEY: "e2e-public-site-key", E2E_FORM_ENABLED: "true" };
try {
  await run(["node_modules/tsx/dist/cli.mjs", "scripts/validate-content.ts"], fixture);
  await run(["node_modules/next/dist/bin/next", "build"], fixture);
  await run(["scripts/test-e2e.mjs", "--grep", "configured form"], fixture);
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally {
  // Never leave a fixture site key in the user's ordinary production build.
  try { await run(["node_modules/next/dist/bin/next", "build"], original); }
  catch (error) { console.error(`Restore build failed: ${error.message}`); process.exitCode = 1; }
}
