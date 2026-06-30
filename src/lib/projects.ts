import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/** True when a project's `year` marks it as still in progress (e.g. "2026–ongoing"). */
const isOngoing = (p: Project): boolean => /ongoing/i.test(p.data.year ?? "");

/**
 * Visible projects, ongoing work first, then reverse-chronological (most recent
 * first), tie-broken on the manual `number` field for stability.
 */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", (p) => p.data.visible !== false);
  return projects.sort((a, b) => {
    const byOngoing = Number(isOngoing(b)) - Number(isOngoing(a));
    if (byOngoing !== 0) return byOngoing;
    const byDate = b.data.date.getTime() - a.data.date.getTime();
    return byDate !== 0 ? byDate : a.data.number.localeCompare(b.data.number);
  });
}

/** The destination for a project card: external site if set, else its page. */
export function projectHref(p: Project): string {
  return p.data.externalUrl ?? `/projects/${p.id}`;
}
