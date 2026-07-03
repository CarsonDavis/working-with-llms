import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const guide = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guide' }),
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    part: z.enum(['Foundation', 'Context', 'Execution', 'Improvement']).nullable(),
    order: z.number(),
    reviewed: z.coerce.date(),
  }),
});

const glossary = defineCollection({
  loader: file('./src/content/glossary.yaml'),
  schema: z.object({
    term: z.string(),
    definition: z.string(),
  }),
});

export const collections = { guide, glossary };
