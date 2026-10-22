# Jonathan Westerfield Portfolio

This repository is being migrated from a legacy Jekyll theme to a static Astro
portfolio. The active branch, `master`, continues to own the public GitHub Pages
URL. The Astro foundation is being developed on feature branches and is not
eligible for production deployment until the release gate passes.

## Stack

- Astro with TypeScript and static output
- Plain modern CSS and no required browser-side JavaScript
- Markdown content collections for the public profile and case studies
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
```

`npm run build` also checks that the generated site does not recreate the old
GitHub Pages project-path bug.

## Content editing

Public content belongs under `src/content/`:

- `site/profile.md` is the single source for approved public profile metadata.
- `work/*.md` will hold one reviewed case study per file.

The collection schema requires an approval status and confidentiality review
for every work entry. Do not add internal notes, source evidence, application
materials, or unapproved claims to this public repository.

## Release gate

The site remains a private-in-practice foundation until all of the following
are present:

1. `src/data/release.json` has `status: public`.
2. `site/profile.md` is approved.
3. At least one approved work entry exists.
4. `public/resume/Jonathan-Westerfield-Resume.pdf` exists.

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
