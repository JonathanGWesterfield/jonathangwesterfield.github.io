import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const buildDirectory = path.resolve("dist");
// A GitHub *user* site is served at the domain root. The old Jekyll site
// mistakenly emitted paths as if this were a project site.
const incorrectUserSitePath =
  /(?:href|src)=["']\/jonathangwesterfield\.github\.io\/|url\(\s*["']?\/jonathangwesterfield\.github\.io\//i;

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);
      return entry.isDirectory() ? filesIn(filePath) : [filePath];
    }),
  );

  return nested.flat();
}

const outputFiles = await filesIn(buildDirectory);
const incorrectPaths = [];

for (const outputFile of outputFiles) {
  const contents = await readFile(outputFile, "utf8");

  if (incorrectUserSitePath.test(contents)) {
    incorrectPaths.push(path.relative(process.cwd(), outputFile));
  }
}

if (incorrectPaths.length > 0) {
  throw new Error(
    `Generated output contains the old GitHub Pages project path in: ${incorrectPaths.join(", ")}`,
  );
}

console.log(
  "Verified that generated output has no duplicated GitHub Pages project path.",
);
