import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const approvalStatus = z.enum(["draft", "approved"]);

const site = defineCollection({
  loader: glob({
    base: "./src/content/site",
    pattern: "**/*.md",
  }),
  schema: z.object({
    name: z.string(),
    professionalTitle: z.string(),
    description: z.string(),
    approvalStatus,
    lastReviewed: z.coerce.date(),
  }),
});

const work = defineCollection({
  loader: glob({
    base: "./src/content/work",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    role: z.string(),
    timeframe: z.string(),
    situation: z.string(),
    constraints: z.array(z.string()),
    technologies: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().int().positive(),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.url(),
        }),
      )
      .default([]),
    heroImage: z.string().optional(),
    imageAlt: z.string().optional(),
    approvalStatus,
    confidentialityReview: z.boolean(),
    lastReviewed: z.coerce.date(),
  }),
});

export const collections = { site, work };
