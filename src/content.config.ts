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

export const collections = { resources, projects };