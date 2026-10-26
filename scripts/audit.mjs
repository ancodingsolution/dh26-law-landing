import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const chromePath = process.env.CHROME_PATH || resolve(".tools/browsers/chromium-1248/chrome-win64/chrome.exe");
if (!existsSync(chromePath)) throw new Error("Set CHROME_PATH to an installed Chromium/Chrome executable.");
const port = Number(process.env.LIGHTHOUSE_PORT || 9222);
const profile = resolve(`.tools/lighthouse-profile-${process.pid}`);
await mkdir(profile, { recursive: true });
await mkdir("docs/qa", { recursive: true });
const chrome = spawn(chromePath, ["--headless", "--no-sandbox", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--no-first-run", "--no-default-browser-check"], { stdio: "ignore", windowsHide: true });
try {
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) break; } catch { /* starting browser */ }
    await delay(100);
  }
  for (const formFactor of ["mobile", "desktop"]) {
    const result = await lighthouse(process.argv[2] || "http://localhost:3200", {
      port, output: ["html", "json"], onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      ...(formFactor === "desktop" ? { screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false } } : {}),
    }, formFactor === "desktop" ? desktopConfig : undefined);
    if (!result) throw new Error("Lighthouse did not return a report");
    await writeFile(`docs/qa/lighthouse-${formFactor}.report.html`, result.report[0]);
    await writeFile(`docs/qa/lighthouse-${formFactor}.report.json`, result.report[1]);
    console.log(formFactor, Object.fromEntries(Object.entries(result.lhr.categories).map(([name, category]) => [name, Math.round(category.score * 100)])));
  }
} finally { chrome.kill(); }
