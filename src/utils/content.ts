import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'posts'>;

// Drafts show in dev and are excluded from production builds.
// There is no scheduling: a post goes live on the first build after draft is set to false.
const isVisible = (entry: Post) => !import.meta.env.PROD || !entry.data.draft;

// Newest first.
export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('posts', isVisible);
  return entries.sort((a, b) => b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf());
}