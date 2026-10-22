import assert from "node:assert/strict";
import { createReadStream, existsSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const projectDirectory = path.dirname(fileURLToPath(import.meta.url));
const buildDirectory = path.resolve(projectDirectory, "../dist");
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
]);

function pathFor(requestUrl) {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://127.0.0.1").pathname);
  const route = pathname === "/" ? "/index.html" : pathname;
  const relativePath = route.endsWith("/") ? `${route}index.html` : route;
  const resolvedPath = path.resolve(buildDirectory, `.${relativePath}`);

  if (!resolvedPath.startsWith(buildDirectory)) {
    return undefined;
  }

  return resolvedPath;
}

function createStaticServer() {
  return http.createServer(async (request, response) => {
    const requestedFile = pathFor(request.url ?? "/");
    const fallbackFile = path.join(buildDirectory, "404.html");
    const filePath =
      requestedFile && existsSync(requestedFile) ? requestedFile : fallbackFile;
    const responseStatus = filePath === requestedFile ? 200 : 404;

    try {
      const file = await stat(filePath);
      response.writeHead(responseStatus, {
        "Content-Length": file.size,
        "Content-Type":
          mimeTypes.get(path.extname(filePath)) ?? "application/octet-stream",
      });
      createReadStream(filePath).pipe(response);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
    }
  });
}

async function collectRoutes(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const routes = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return collectRoutes(filePath);
      }

      if (!entry.name.endsWith(".html")) {
        return [];
      }

      const relativePath = path
        .relative(buildDirectory, filePath)
        .split(path.sep)
        .join("/");

      if (relativePath === "index.html") {
        return ["/"];
      }

      if (relativePath.endsWith("/index.html")) {
        return [`/${relativePath.slice(0, -"index.html".length)}`];
      }

      return [`/${relativePath}`];
    }),
  );

  return routes.flat().sort();
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        reject(new Error("Unable to determine browser test server address."));
        return;
      }
      resolve(`http://127.0.0.1:${address.port}`);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

async function checkAxe(page, route) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  assert.equal(
    results.violations.length,
    0,
    `${route} has accessibility violations: ${results.violations
      .map((violation) => `${violation.id} (${violation.nodes.length})`)
      .join(", ")}`,
  );
}

const server = createStaticServer();
const baseUrl = await listen(server);
const browser = await chromium.launch();

try {
  const routes = await collectRoutes(buildDirectory);
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const desktopPage = await desktopContext.newPage();

  for (const route of routes) {
    const response = await desktopPage.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle",
    });
    assert(response, `No response received for ${route}`);
    assert.ok(response.status() < 500, `${route} returned ${response.status()}`);
    assert.equal(
      await desktopPage.locator("h1").count(),
      1,
      `${route} must have one h1`,
    );
    await checkAxe(desktopPage, route);
  }

  await desktopPage.goto(baseUrl, { waitUntil: "networkidle" });
  await desktopPage.keyboard.press("Tab");
  assert.equal(
    await desktopPage.locator(":focus").getAttribute("href"),
    "#main-content",
    "The first keyboard focus target must be the skip link.",
  );
  await desktopPage.getByRole("link", { name: "Work", exact: true }).click();
  await desktopPage.waitForURL(`${baseUrl}/work/`);
  assert.equal(
    await desktopPage.getByRole("heading", { level: 1 }).innerText(),
    "Case studies that show how the work was done.",
  );

  const missingRoute = await desktopPage.goto(`${baseUrl}/missing-route/`, {
    waitUntil: "networkidle",
  });
  assert.equal(missingRoute?.status(), 404, "Unknown routes must serve the 404 page.");
  assert.equal(
    await desktopPage.getByRole("heading", { level: 1 }).innerText(),
    "This page is not here.",
  );

  const mobileContext = await browser.newContext({
    viewport: { width: 320, height: 720 },
  });
  const mobilePage = await mobileContext.newPage();

  for (const route of routes) {
    await mobilePage.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    const hasHorizontalOverflow = await mobilePage.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    assert.equal(hasHorizontalOverflow, false, `${route} overflows a 320px viewport.`);
  }

  await mobileContext.close();
  await desktopContext.close();
  console.log(
    `Browser navigation, mobile reflow, and axe checks passed for ${routes.length} routes.`,
  );
} finally {
  await browser.close();
  await close(server);
}
