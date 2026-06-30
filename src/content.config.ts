import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Single canonical project model, consolidating the three drifted sources
// (projects-data.js for listing, /projects/*.html for body, /site MDX schema).
// Images live in /public/images and are referenced by string path (no
// astro:assets transform) to preserve the original markup 1:1.
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    number: z.string(), // "01"… display + listing order
    date: z.coerce.date(),
    summary: z.string(),
    cover: z.string(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    visible: z.boolean().default(true),

    // Depth + presentation
    tier: z.enum(["case-study", "project"]).default("project"),
    externalUrl: z.string().url().optional(), // e.g. Embodied Cartographies

    // Rail metadata (research-forward)
    role: z.string().optional(),
    year: z.string().optional(),
    methods: z.array(z.string()).default([]),
    outputs: z.array(z.string()).default([]),

    // Research framing (case studies)
    researchQuestion: z.string().optional(),
    contribution: z.string().optional(),

    gallery: z
      .array(z.object({ src: z.string(), alt: z.string().optional() }))
      .default([]),
  }),
});

export const collections = { projects };
