# Jonathan Westerfield Portfolio

This repository is being migrated from a legacy Jekyll theme to a static Astro
portfolio. The active branch, `master`, continues to own the public GitHub Pages
URL. The Astro foundation is being developed on feature branches and is not
eligible for production deployment until the release gate passes.

## Stack

- Astro with TypeScript and static output
- Plain modern CSS and no required browser-side JavaScript
- Markdown content collections for the public profile and engineering stories
- GitHub Actions and GitHub Pages for the eventual production build

## Local development

Use Node 24, as recorded in `.nvmrc`.

```sh
npm ci
npm run dev
```

Useful checks:

```sh
npm run format:check
npm run check
npm run build
npm run test:browser
```

`npm run build` also checks that the generated site does not recreate the old
GitHub Pages project-path bug, includes the expected accessibility landmarks,
keeps one page heading per route, and catches broken internal links.

`npm run test:browser` serves the built output locally, checks each static route
at desktop and 320px widths, exercises the primary navigation and skip link,
and runs axe WCAG 2.2 A/AA checks. Run `npx playwright install chromium` once
before the first local browser test.

## Content editing

Public content belongs under `src/content/`:

- `site/profile.md` is the single source for approved public profile metadata and
  the concise HTML experience snapshot on the résumé route.
- `work/*.md` will hold one reviewed engineering story per file.

The collection schema requires an approval status and confidentiality review
for every work entry. Do not add internal notes, source evidence, application
materials, or unapproved claims to this public repository.

## Release gate

The site remains a private-in-practice foundation until all of the following
are present:

1. `src/data/release.json` has `status: public`.
2. `site/profile.md` is approved.
3. The profile contains the approved About, résumé, and contact summaries; a concise
   experience snapshot; plus GitHub, LinkedIn, and contact routes.
4. The profile references `resume/Jonathan-Westerfield-Resume.pdf`, and that file exists.
5. At least one approved, confidentiality-reviewed work entry exists.
6. The generated résumé includes its accessible experience snapshot and the
   generated pages contain no development placeholders.

The workflow validates every pull request and push. It creates and deploys a
GitHub Pages artifact only when that release gate returns true on `master`.
Before the first eligible deployment, switch the repository's GitHub Pages
source to **GitHub Actions** in repository settings.

## Migration notes

This is a GitHub user site, so `astro.config.mjs` deliberately sets the root
site URL and does not configure a repository-name `base` path. The previous
Jekyll configuration used a project-site base path and caused static assets to
resolve incorrectly.

The legacy source remains in the starting commit and is locally tagged
`pre-astro-archive` on the Astro migration branch. Before public launch, follow
the rollback and legacy-URL preservation process in the approved portfolio
design plan.
