import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    status: z.string(),
    // one sentence shown on the landing page card
    summary: z.string(),
    // optional short lead paragraph shown at the top of the full write-up (beside the illustration).
    // When it is set, the Markdown body becomes the long-form article below the key facts.
    intro: z.string().optional(),
    order: z.number().default(99),
    // "owner/name" on GitHub; enables the live "last commit" line
    repo: z.string().optional(),
    // branch to read the last commit from (defaults to the repo default branch)
    branch: z.string().optional(),
    // optional illustration beside the description (see ProjectArt.astro)
    art: z.enum(["rfid-coffee"]).optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    roadmap: z
      .array(z.object({ state: z.enum(["done", "building", "planned"]), text: z.string() }))
      .default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
