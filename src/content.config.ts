import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const approvalStatus = z.enum(["draft", "approved"]);
const publicLink = z.object({
  label: z.string(),
  url: z.url(),
  kind: z.enum(["github", "linkedin", "contact", "other"]),
});

const experienceSnapshot = z.object({
  organization: z.string().min(1),
  role: z.string().min(1),
  timeframe: z.string().min(1),
  summary: z.string().min(1),
});

const site = defineCollection({
  loader: glob({
    base: "./src/content/site",
    pattern: "**/*.md",
  }),
  schema: z.object({
    name: z.string(),
    professionalTitle: z.string(),
    description: z.string(),
    about: z.string().optional(),
    resumeSummary: z.string().optional(),
    contactIntroduction: z.string().optional(),
    availabilityNote: z.string().optional(),
    publicLinks: z.array(publicLink).default([]),
    resumeFile: z.string().optional(),
    experience: z.array(experienceSnapshot).min(2).max(4).optional(),
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
    responsibility: z.string(),
    constraints: z.array(z.string()),
    approach: z.string(),
    outcome: z.string(),
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
    heroImage: z
      .object({
        src: z.string().startsWith("/images/"),
        alt: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
    approvalStatus,
    confidentialityReview: z.boolean(),
    relevance: z.string(),
    lastReviewed: z.coerce.date(),
  }),
});

export const collections = { site, work };
