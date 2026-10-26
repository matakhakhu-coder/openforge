import { getCollection, type CollectionEntry } from 'astro:content';

export type Tool = CollectionEntry<'tools'>;

// Same rule as posts: drafts show in dev and are hidden in production. No scheduling.
const isVisible = (entry: Tool) => !import.meta.env.PROD || !entry.data.draft;

// Lowest order first, then by title.
export async function getTools(): Promise<Tool[]> {
  const entries = await getCollection('tools', isVisible);
  return entries.sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}