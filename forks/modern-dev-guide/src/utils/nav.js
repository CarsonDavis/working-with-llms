import { getCollection } from 'astro:content';

const PART_ORDER = ['Foundation', 'Context', 'Execution', 'Improvement'];

// Returns { startHere, parts, all, bySlug } — `all` sorted by order (which
// doubles as "Chapter n of 7"), `parts` an ordered array of
// { label, chapters } for the rail and home page.
export async function getNav() {
  const entries = await getCollection('guide');
  const all = [...entries].sort((a, b) => a.data.order - b.data.order);

  const startHere = all.find((e) => e.data.part === null);
  const parts = PART_ORDER.map((label) => ({
    label,
    chapters: all.filter((e) => e.data.part === label),
  })).filter((p) => p.chapters.length > 0);

  const bySlug = Object.fromEntries(all.map((e) => [e.id, e]));

  return { startHere, parts, all, bySlug };
}

export function wordCount(body) {
  return (body.match(/[\w'-]+/g) || []).length;
}

export function readingTime(body) {
  const words = wordCount(body);
  const minutes = Math.max(1, Math.round(words / 215));
  return `${minutes} min`;
}
