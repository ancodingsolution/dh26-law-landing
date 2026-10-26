import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

// Own the direct Next process so shutdown works on Windows without taskkill/WMI.
const env = { ...process.env };
if (!env.PLAYWRIGHT_BROWSERS_PATH && existsSync(".tools/browsers")) env.PLAYWRIGHT_BROWSERS_PATH = `${process.cwd()}/.tools/browsers`;
let server;
let runner;
const cleanup = () => { runner?.kill(); server?.kill(); };
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
try {
  if (!env.E2E_BASE_URL) {
    env.E2E_BASE_URL = "http://127.0.0.1:3100";
    server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100"], { env, stdio: "inherit" });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) throw new Error("Next server failed to start. Build first and ensure port 3100 is free.");
      try { ready = (await fetch(env.E2E_BASE_URL, { signal: AbortSignal.timeout(500) })).ok; } catch { /* still starting */ }
      if (ready) break;
      await delay(200);
    }
    if (!ready) throw new Error("Next server readiness timeout");
  }
  runner = spawn(process.execPath, ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)], { env, stdio: "inherit" });
  const [code] = await once(runner, "exit");
  process.exitCode = code ?? 1;
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { server?.kill(); }
