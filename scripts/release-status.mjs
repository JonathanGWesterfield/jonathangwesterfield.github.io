import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const release = JSON.parse(await readFile("src/data/release.json", "utf8"));

async function fileExists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function hasApprovedWork() {
  const directory = "src/content/work";
  const entries = await readdir(directory, { withFileTypes: true });
  const markdownEntries = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(".md"),
  );

  const contents = await Promise.all(
    markdownEntries.map((entry) => readFile(path.join(directory, entry.name), "utf8")),
  );

  return contents.some((content) => /^approvalStatus:\s*approved\s*$/m.test(content));
}

const profile = await readFile("src/content/site/profile.md", "utf8");
const profileApproved = /^approvalStatus:\s*approved\s*$/m.test(profile);
const resumeExists = await fileExists("public/resume/Jonathan-Westerfield-Resume.pdf");
const releaseReady =
  release.status === "public" &&
  profileApproved &&
  resumeExists &&
  (await hasApprovedWork());

process.stdout.write(`${releaseReady}\n`);
