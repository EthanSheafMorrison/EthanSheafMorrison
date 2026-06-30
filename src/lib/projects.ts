import { getCollection, type CollectionEntry } from "astro:content";

export type Project = CollectionEntry<"projects">;

/** Visible projects in reverse-chronological order (most recent first). */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection("projects", (p) => p.data.visible !== false);
  return projects.sort((a, b) => {
    const byDate = b.data.date.getTime() - a.data.date.getTime();
    // Tie-break on the manual `number` field so same-date projects stay stable.
    return byDate !== 0 ? byDate : a.data.number.localeCompare(b.data.number);
  });
}

/** The destination for a project card: external site if set, else its page. */
export function projectHref(p: Project): string {
  return p.data.externalUrl ?? `/projects/${p.id}`;
}
