# Portfolio site: notes for Claude

- Static Astro 5 site, deployed to GitHub Pages on push to `main`. No server code.
- Content lives in `src/data/profile.json` and `src/content/projects/*.md`. Change content there;
  only touch `.astro` files or `global.css` when the layout or design must change.
- The page is in English. Keep copy plain and factual; never invent skills, employers or
  results. Python is listed as basic and should stay that way unless Szabolcs says otherwise.
- Run `npm run build` before committing; the build fails on invalid project frontmatter.
- Colours are CSS tokens on `:root` with dark-mode overrides; never hard-code a colour in a component.
