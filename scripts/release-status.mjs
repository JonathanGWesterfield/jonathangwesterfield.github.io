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

  return contents.some(
    (content) =>
      /^approvalStatus:\s*approved\s*$/m.test(content) &&
      /^confidentialityReview:\s*true\s*$/m.test(content),
  );
}

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

async function renderedOutputIsReady() {
  try {
    const outputFiles = await filesIn("dist");
    const htmlFiles = outputFiles.filter((filePath) => filePath.endsWith(".html"));
    const contents = await Promise.all(
      htmlFiles.map((filePath) => readFile(filePath, "utf8")),
    );

    return (
      htmlFiles.length > 0 &&
      contents.every(
        (content) =>
          !/portfolio foundation|under review|to be reviewed|draft engineering story/i.test(
            content,
          ),
      )
    );
  } catch {
    return false;
  }
}

async function renderedResumeHasExperienceSnapshot() {
  try {
    const resume = await readFile("dist/resume/index.html", "utf8");
    const experienceList = resume.match(
      /<ol\b[^>]*\bdata-experience-snapshot\b[^>]*>([\s\S]*?)<\/ol>/i,
    );

    return (
      /<section\b[^>]*\baria-labelledby=["']experience-heading["'][^>]*>/i.test(
        resume,
      ) &&
      experienceList !== null &&
      (experienceList[1].match(/<li\b/gi) ?? []).length >= 2
    );
  } catch {
    return false;
  }
}

function profileHasLinkKind(profile, kind) {
  return new RegExp(`^\\s+kind:\\s*${kind}\\s*$`, "m").test(profile);
}

function profileHasReleasePlaceholders(profile) {
  return /portfolio foundation|under review|to be reviewed/i.test(profile);
}

function profileHasValue(profile, field) {
  return new RegExp(`^${field}:\\s*\\S.+$`, "m").test(profile);
}

function profileHasExperienceSnapshot(profile) {
  return (profile.match(/^\s{2}- organization:\s*\S.+$/gm) ?? []).length >= 2;
}

const profile = await readFile("src/content/site/profile.md", "utf8");
const profileApproved = /^approvalStatus:\s*approved\s*$/m.test(profile);
const profileLinksReady = ["github", "linkedin", "contact"].every((kind) =>
  profileHasLinkKind(profile, kind),
);
const profilePageCopyReady = ["about", "resumeSummary", "contactIntroduction"].every(
  (field) => profileHasValue(profile, field),
);
const profileExperienceReady = profileHasExperienceSnapshot(profile);
const profileIsReady =
  profileApproved &&
  profileLinksReady &&
  profilePageCopyReady &&
  profileExperienceReady &&
  !profileHasReleasePlaceholders(profile);
const profileHasApprovedResume =
  /^resumeFile:\s*\/resume\/Jonathan-Westerfield-Resume\.pdf\s*$/m.test(profile);
const resumeExists = await fileExists("public/resume/Jonathan-Westerfield-Resume.pdf");
const releaseReady =
  release.status === "public" &&
  profileIsReady &&
  profileHasApprovedResume &&
  resumeExists &&
  (await hasApprovedWork()) &&
  (await renderedResumeHasExperienceSnapshot()) &&
  (await renderedOutputIsReady());

process.stdout.write(`${releaseReady}\n`);
