import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const buildDirectory = path.resolve("dist");
const htmlFiles = [];
const problems = [];

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const filePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await collectHtmlFiles(filePath);
      } else if (entry.name.endsWith(".html")) {
        htmlFiles.push(filePath);
      }
    }),
  );
}

function addProblem(filePath, message) {
  problems.push(`${path.relative(process.cwd(), filePath)}: ${message}`);
}

function countMatches(contents, expression) {
  return [...contents.matchAll(expression)].length;
}

function destinationFor(href) {
  const route = href.split(/[?#]/, 1)[0];

  if (route === "/") {
    return path.join(buildDirectory, "index.html");
  }

  if (route.endsWith("/")) {
    return path.join(buildDirectory, route.slice(1), "index.html");
  }

  if (path.extname(route)) {
    return path.join(buildDirectory, route.slice(1));
  }

  return path.join(buildDirectory, route.slice(1), "index.html");
}

async function validateInternalLinks(filePath, contents) {
  const linkExpression = /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>/gi;

  for (const match of contents.matchAll(linkExpression)) {
    const href = match[1];

    if (href.startsWith("#")) {
      continue;
    }

    if (href.startsWith("//")) {
      addProblem(filePath, `external link must use an explicit HTTPS scheme: ${href}`);
      continue;
    }

    if (/^[a-z][a-z\d+.-]*:/i.test(href)) {
      try {
        const url = new URL(href);

        if (url.protocol === "https:" && !url.hostname) {
          addProblem(filePath, `external link is missing a host: ${href}`);
        } else if (
          url.protocol === "mailto:" &&
          !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url.pathname)
        ) {
          addProblem(filePath, `contact link is not a valid email route: ${href}`);
        } else if (url.protocol !== "https:" && url.protocol !== "mailto:") {
          addProblem(filePath, `unsupported external link protocol: ${href}`);
        }

        if (
          /\btarget=["']_blank["']/i.test(match[0]) &&
          !/\brel=["'][^"']*\bnoopener\b[^"']*["']/i.test(match[0])
        ) {
          addProblem(filePath, `new-tab link is missing rel=noopener: ${href}`);
        }
      } catch {
        addProblem(filePath, `external link is malformed: ${href}`);
      }

      continue;
    }

    if (!href.startsWith("/")) {
      addProblem(filePath, `link must use a root-relative path: ${href}`);
      continue;
    }

    try {
      await readFile(destinationFor(href));
    } catch {
      addProblem(filePath, `broken internal link: ${href}`);
    }
  }
}

function validateDocument(filePath, contents) {
  if (!/<html\b[^>]*\blang=["']en["']/i.test(contents)) {
    addProblem(filePath, 'missing lang="en" on the document element');
  }

  if (!/<meta\b[^>]*\bname=["']viewport["']/i.test(contents)) {
    addProblem(filePath, "missing viewport metadata");
  }

  if (!/<meta\b[^>]*\bname=["']description["']/i.test(contents)) {
    addProblem(filePath, "missing meta description");
  }

  if (!/<title>[^<]+<\/title>/i.test(contents)) {
    addProblem(filePath, "missing document title");
  }

  if (!/<a\b[^>]*\bhref=["']#main-content["']/i.test(contents)) {
    addProblem(filePath, "missing skip link to main content");
  }

  if (!/<main\b[^>]*\bid=["']main-content["']/i.test(contents)) {
    addProblem(filePath, "missing main content landmark");
  }

  const headingCount = countMatches(contents, /<h1\b/gi);
  if (headingCount !== 1) {
    addProblem(filePath, `expected one h1, found ${headingCount}`);
  }

  for (const image of contents.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=["'][^"']*["']/i.test(image[0])) {
      addProblem(filePath, "image is missing an alt attribute");
    }
  }
}

await collectHtmlFiles(buildDirectory);

for (const filePath of htmlFiles) {
  const contents = await readFile(filePath, "utf8");
  validateDocument(filePath, contents);
  await validateInternalLinks(filePath, contents);
}

if (problems.length > 0) {
  throw new Error(`Static site checks failed:\n- ${problems.join("\n- ")}`);
}

console.log(
  `Validated structure, internal links, and external link safety for ${htmlFiles.length} HTML route(s).`,
);
