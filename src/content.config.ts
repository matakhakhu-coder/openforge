import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const provenance = z.object({
  origin: z.enum(['manual', 'forge-export']).default('manual'),
  status: z.enum(['unverified', 'live', 'moved', 'dead']).default('unverified'),
  confidence: z.enum(['low', 'medium', 'high']).default('low'),
  checkedOn: z.coerce.date().nullable().default(null),
  notes: z.string().optional(),
});

const resources = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.enum(['gazettes', 'tenders', 'municipal-finance', 'legal', 'other']),
    publisher: z.string(),
    url: z.string().url(),
    formats: z.array(z.string()).default([]),
    licence: z.string().nullable().default(null),
    provenance,
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    maintainer: z.string(),
    url: z.string().url(),
    repo: z.string().url().nullable().default(null),
    tags: z.array(z.string()).default([]),
    projectStatus: z.enum(['active', 'archived', 'unknown']).default('unknown'),
    provenance,
  }),
});

// Lowercase kebab-case, so tags are already URL-safe.
const tag = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Tags must be lowercase-kebab-case');

// Blog posts are the author's own commentary. They carry no provenance rating.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(3),
    description: z.string().min(10).max(200),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().min(2).max(60).optional(),
    tags: z.array(tag).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { resources, projects, posts };