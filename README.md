# vlszabolcs.github.io

Personal portfolio of Szabolcs Veres-Lakos: embedded systems, engineering IT and LLM tooling.

Built with [Astro](https://astro.build) as a static site and deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Editing content

| What | Where |
|---|---|
| Name, headline, about, toolbox, background, contact | `src/data/profile.json` |
| Projects (one file each) | `src/content/projects/*.md` |
| Styles and colours | `src/styles/global.css` |

A project file looks like this:

```md
---
title: My project
status: In progress        # free text shown as the pill
summary: "One sentence for the card on the home page."
intro: "Optional lead paragraph at the top of the full write-up."
order: 3                   # position on the page
repo: vlszabolcs/my-repo   # optional: shows the live "last commit" line
branch: main               # optional
art: rfid-coffee           # optional illustration (src/components/ProjectArt.astro)
specs:
  - { label: Hardware, value: "ESP32-S3" }
roadmap:                   # state: done | building | planned
  - { state: building, text: "What I'm working on" }
links:
  - { label: "Source", url: "https://github.com/vlszabolcs/my-repo" }
draft: false               # true hides it
---

The write-up, in Markdown.
```

The home page shows only the card (title, status, `summary`). A click opens the full write-up in an
overlay, and every project also has its own page at `/projects/<file name>/`.

### Short post or long article

- **Short:** leave out `intro`. The Markdown body is shown at the top, beside the illustration.
- **Long:** set `intro`. The intro goes at the top, then the key facts (`specs`), then the Markdown
  body as a full-width article with `##` / `###` headings, lists, code blocks, tables and images,
  then the roadmap and links.

Images for a post go in `public/projects/<file name>/` and are referenced as
`![What it shows](/projects/<file name>/photo.jpg)`. Keep photos under ~300 KB
(about 1600 px wide is plenty).

## Local development

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Custom domain

1. Add `public/CNAME` containing the bare domain (e.g. `example.dev`).
2. Change `site` in `astro.config.mjs` to `https://example.dev`.
3. At the registrar: four `A` records for `@` → `185.199.108.153`, `185.199.109.153`,
   `185.199.110.153`, `185.199.111.153`, and `CNAME www` → `vlszabolcs.github.io`.
4. In repo Settings → Pages, enter the domain and enable **Enforce HTTPS**.
